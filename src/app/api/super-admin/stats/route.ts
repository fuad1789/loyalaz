import { NextResponse } from 'next/server';
import { getModels } from '@/lib/models';

// GET - Platform stats (no auth for super admin - secret URL)
export async function GET() {
  try {
    const { Tenant, Card, Transaction } = await getModels();

    const totalTenants = await Tenant.countDocuments();
    const totalCards = await Card.countDocuments();
    const activeCards = await Card.countDocuments({ status: 'active' });
    const totalTransactions = await Transaction.countDocuments();

    return NextResponse.json({
      totalTenants,
      totalCards,
      activeCards,
      totalTransactions,
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return NextResponse.json(
      { error: 'Statistikaları yükləmək mümkün olmadı' },
      { status: 500 }
    );
  }
}