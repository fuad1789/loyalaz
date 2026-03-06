import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Card, Tenant } from '@/lib/models';

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const uuid = params.uuid;

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

    // Get tenant info
    const tenant = await Tenant.findById(card.tenantId);

    return NextResponse.json({
      success: true,
      card: {
        uuid: card.uuid,
        status: card.status,
        currentPoints: card.currentPoints,
        totalRedemptions: card.totalRedemptions,
      },
      tenant: {
        name: tenant?.name || 'Restoran',
        pointThreshold: tenant?.pointThreshold || 6,
      },
    });

  } catch (error) {
    console.error('Get card error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Server xətası' 
    }, { status: 500 });
  }
}