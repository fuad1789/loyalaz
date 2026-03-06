import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Card, Transaction } from '@/lib/models';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user.tenantId || session.user.role !== 'staff') {
      return NextResponse.json({ 
        success: false, 
        message: 'İcazə yoxdur' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { uuid } = body;

    if (!uuid) {
      return NextResponse.json({ 
        success: false, 
        message: 'UUID tələb olunur' 
      }, { status: 400 });
    }

    await connectDB();

    // Find the card
    const card = await Card.findOne({ uuid });
    
    if (!card) {
      return NextResponse.json({ 
        success: false, 
        message: 'Kart tapılmadı' 
      }, { status: 404 });
    }

    // Check if card belongs to staff's tenant
    if (card.tenantId.toString() !== session.user.tenantId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Bu kart başqa restorana aiddir' 
      }, { status: 403 });
    }

    // Reset points and increment redemptions
    card.currentPoints = 0;
    card.totalRedemptions += 1;
    card.lastScannedAt = new Date();
    await card.save();

    // Create transaction
    await Transaction.create({
      cardId: card._id,
      tenantId: session.user.tenantId,
      staffId: session.user.id,
      actionType: 'reward',
    });

    return NextResponse.json({
      success: true,
      message: 'Hədiyyə təqdim edildi!',
      card: {
        uuid: card.uuid,
        currentPoints: card.currentPoints,
        totalRedemptions: card.totalRedemptions,
      },
    });

  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server xətası' 
    }, { status: 500 });
  }
}