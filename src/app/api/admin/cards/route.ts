import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/lib/db';
import { Card } from '@/lib/models';
import { auth } from '@/lib/auth';

// GET - Fetch all cards for tenant
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json([], { status: 401 });
    }

    await connectDB();
    const cards = await Card.find({ tenantId: session.user.tenantId })
      .sort({ createdAt: -1 })
      .limit(500);
    
    return NextResponse.json(JSON.parse(JSON.stringify(cards)));
  } catch (error) {
    console.error('Get cards error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST - Generate bulk cards
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'İcazə yoxdur' }, { status: 401 });
    }

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1 || quantity > 100) {
      return NextResponse.json({ error: 'Yanlış miqdar' }, { status: 400 });
    }

    await connectDB();

    // Generate cards
    const cards = [];
    for (let i = 0; i < quantity; i++) {
      cards.push({
        uuid: uuidv4(),
        tenantId: session.user.tenantId,
        status: 'inactive',
        currentPoints: 0,
        totalRedemptions: 0,
      });
    }

    const createdCards = await Card.insertMany(cards);

    return NextResponse.json({ 
      success: true,
      count: createdCards.length,
      cards: JSON.parse(JSON.stringify(createdCards))
    });
  } catch (error) {
    console.error('Create cards error:', error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}