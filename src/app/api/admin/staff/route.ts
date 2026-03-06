import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { User, Transaction } from '@/lib/models';
import { auth } from '@/lib/auth';

// GET - Fetch all staff for tenant
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json([], { status: 401 });
    }

    await connectDB();
    
    const staff = await User.find({ 
      tenantId: session.user.tenantId, 
      role: 'staff' 
    }).sort({ createdAt: -1 });

    // Get stats for each staff member
    const staffWithStats = await Promise.all(
      staff.map(async (member) => {
        const scans = await Transaction.countDocuments({
          staffId: member._id,
          actionType: { $in: ['activation', 'point_added'] }
        });
        
        const rewards = await Transaction.countDocuments({
          staffId: member._id,
          actionType: 'reward'
        });

        return {
          ...JSON.parse(JSON.stringify(member)),
          stats: { scans, rewards }
        };
      })
    );
    
    return NextResponse.json(staffWithStats);
  } catch (error) {
    console.error('Get staff error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST - Create new staff member
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'İcazə yoxdur' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Bütün sahələri doldurun' }, { status: 400 });
    }

    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Bu email artıq istifadə olunur' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create staff member
    const staff = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'staff',
      tenantId: session.user.tenantId,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Əməkdaş uğurla yaradıldı',
      staff: JSON.parse(JSON.stringify(staff))
    });
  } catch (error) {
    console.error('Create staff error:', error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}