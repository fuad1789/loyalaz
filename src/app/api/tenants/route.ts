import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { Tenant, User, Card } from '@/lib/models';

// GET - Fetch all tenants with card stats (no auth for super admin - secret URL)
export async function GET() {
  try {
    await connectDB();
    const tenants = await Tenant.find().sort({ createdAt: -1 }).lean();
    
    // Fetch card stats for each tenant and ensure isActive has a default
    const tenantsWithStats = await Promise.all(
      tenants.map(async (tenant) => {
        const totalCards = await Card.countDocuments({ tenantId: tenant._id });
        const activeCards = await Card.countDocuments({ tenantId: tenant._id, status: 'active' });
        
        // If tenant doesn't have isActive field, set it to true and update in DB
        if (tenant.isActive === undefined || tenant.isActive === null) {
          await Tenant.findByIdAndUpdate(tenant._id, { isActive: true });
        }
        
        return {
          ...tenant,
          isActive: tenant.isActive ?? true,
          cardStats: {
            total: totalCards,
            active: activeCards,
          },
        };
      })
    );
    
    return NextResponse.json(JSON.parse(JSON.stringify(tenantsWithStats)));
  } catch (error) {
    console.error('Get tenants error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST - Create new tenant (no auth for super admin - secret URL)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, pointThreshold, plan, adminName, adminEmail, adminPassword } = body;

    if (!name || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'Bütün sahələri doldurun' }, { status: 400 });
    }

    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Bu email artıq istifadə olunur' }, { status: 400 });
    }

    // Create tenant
    const tenant = await Tenant.create({
      name,
      pointThreshold: pointThreshold || 6,
      plan: plan || 'Sadə',
      isActive: true,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create tenant admin
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'tenant_admin',
      tenantId: tenant._id,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Restoran uğurla yaradıldı',
      tenant: JSON.parse(JSON.stringify(tenant))
    });
  } catch (error) {
    console.error('Create tenant error:', error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}