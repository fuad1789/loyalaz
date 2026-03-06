import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Card, Transaction, Tenant } from '@/lib/models';
import { auth } from '@/lib/auth';

const COOLDOWN_HOURS = 12;

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user.tenantId || session.user.role !== 'staff') {
      return NextResponse.json({ 
        success: false, 
        action: 'error',
        message: 'İcazə yoxdur' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { uuid } = body;

    if (!uuid) {
      return NextResponse.json({ 
        success: false, 
        action: 'error',
        message: 'UUID tələb olunur' 
      }, { status: 400 });
    }

    await connectDB();

    // Find the card
    const card = await Card.findOne({ uuid });
    
    if (!card) {
      return NextResponse.json({ 
        success: false, 
        action: 'error',
        message: 'Kart tapılmadı' 
      }, { status: 404 });
    }

    // Check if card belongs to staff's tenant
    if (card.tenantId.toString() !== session.user.tenantId) {
      return NextResponse.json({ 
        success: false, 
        action: 'error',
        message: 'Bu kart başqa restorana aiddir' 
      }, { status: 403 });
    }

    // Get tenant for threshold
    const tenant = await Tenant.findById(session.user.tenantId);
    
    // Check if tenant is active
    if (!tenant || !tenant.isActive) {
      return NextResponse.json({ 
        success: false, 
        action: 'error',
        message: 'Bu restoran hazırda deaktivdir. Zəhmət olmasa idarəçi ilə əlaqə saxlayın.' 
      }, { status: 403 });
    }
    
    const pointThreshold = tenant.pointThreshold || 6;

    // Handle INACTIVE card - Activation
    if (card.status === 'inactive') {
      // Activate the card and add 1 point
      card.status = 'active';
      card.currentPoints = 1;
      card.lastScannedAt = new Date();
      await card.save();

      // Create transaction
      await Transaction.create({
        cardId: card._id,
        tenantId: session.user.tenantId,
        staffId: session.user.id,
        actionType: 'activation',
      });

      return NextResponse.json({
        success: true,
        action: 'activation',
        message: 'Kart aktivləşdirildi! +1 xal',
        card: {
          uuid: card.uuid,
          currentPoints: card.currentPoints,
          status: card.status,
        },
        tenant: {
          pointThreshold,
        },
      });
    }

    // Handle ACTIVE card - Check cooldown
    if (card.status === 'active') {
      const now = new Date();
      const lastScan = card.lastScannedAt ? new Date(card.lastScannedAt) : null;
      
      // Check cooldown
      if (lastScan) {
        const hoursSinceLastScan = (now.getTime() - lastScan.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastScan < COOLDOWN_HOURS) {
          const hoursLeft = Math.ceil(COOLDOWN_HOURS - hoursSinceLastScan);
          return NextResponse.json({
            success: false,
            action: 'cooldown',
            message: `Bu karta son 12 saat ərzində xal vurulub. ${hoursLeft} saat gözləyin.`,
            card: {
              uuid: card.uuid,
              currentPoints: card.currentPoints,
              status: card.status,
            },
            tenant: {
              pointThreshold,
            },
          });
        }
      }

      // Check if reached threshold - ready for reward
      if (card.currentPoints >= pointThreshold) {
        return NextResponse.json({
          success: true,
          action: 'reward',
          message: `Təbrik edirik! ${pointThreshold} xal toplandı. Hədiyyə hazırdır!`,
          card: {
            uuid: card.uuid,
            currentPoints: card.currentPoints,
            status: card.status,
          },
          tenant: {
            pointThreshold,
          },
        });
      }

      // Add point
      card.currentPoints += 1;
      card.lastScannedAt = new Date();
      
      // Check if reached threshold after adding point
      if (card.currentPoints >= pointThreshold) {
        await card.save();
        
        await Transaction.create({
          cardId: card._id,
          tenantId: session.user.tenantId,
          staffId: session.user.id,
          actionType: 'point_added',
        });

        return NextResponse.json({
          success: true,
          action: 'reward',
          message: `Təbrik edirik! ${pointThreshold} xal toplandı. Hədiyyə hazırdır!`,
          card: {
            uuid: card.uuid,
            currentPoints: card.currentPoints,
            status: card.status,
          },
          tenant: {
            pointThreshold,
          },
        });
      }

      await card.save();

      // Create transaction
      await Transaction.create({
        cardId: card._id,
        tenantId: session.user.tenantId,
        staffId: session.user.id,
        actionType: 'point_added',
      });

      return NextResponse.json({
        success: true,
        action: 'point_added',
        message: 'Xal əlavə edildi!',
        card: {
          uuid: card.uuid,
          currentPoints: card.currentPoints,
          status: card.status,
        },
        tenant: {
          pointThreshold,
        },
      });
    }

    return NextResponse.json({ 
      success: false, 
      action: 'error',
      message: 'Naməlum xəta baş verdi' 
    }, { status: 500 });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ 
      success: false, 
      action: 'error',
      message: 'Server xətası' 
    }, { status: 500 });
  }
}