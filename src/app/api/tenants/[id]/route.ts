import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Tenant, User, Card, Transaction } from '@/lib/models';

// PUT - Update tenant (no auth for super admin - secret URL)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, pointThreshold, plan, isActive } = body;

    await connectDB();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (pointThreshold !== undefined) updateData.pointThreshold = pointThreshold;
    if (plan !== undefined) updateData.plan = plan;
    if (isActive !== undefined) updateData.isActive = isActive;

    const tenant = await Tenant.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!tenant) {
      return NextResponse.json({ error: 'Restoran tapılmadı' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: isActive !== undefined 
        ? (isActive ? 'Restoran aktivləşdirildi!' : 'Restoran donduruldu!')
        : 'Restoran məlumatları yeniləndi',
      tenant: JSON.parse(JSON.stringify(tenant))
    });
  } catch (error) {
    console.error('Update tenant error:', error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}

// DELETE - Delete tenant (no auth for super admin - secret URL)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Delete all transactions for cards belonging to this tenant
    const cards = await Card.find({ tenantId: params.id });
    const cardIds = cards.map(card => card._id);
    await Transaction.deleteMany({ cardId: { $in: cardIds } });

    // Delete all cards for this tenant
    await Card.deleteMany({ tenantId: params.id });

    // Delete all users (staff and admin) for this tenant
    await User.deleteMany({ tenantId: params.id });

    // Delete the tenant
    const tenant = await Tenant.findByIdAndDelete(params.id);

    if (!tenant) {
      return NextResponse.json({ error: 'Restoran tapılmadı' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Restoran və bütün məlumatları silindi'
    });
  } catch (error) {
    console.error('Delete tenant error:', error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}