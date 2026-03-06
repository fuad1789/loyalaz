import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';

// GET - Create super admin user (only if doesn't exist)
export async function GET() {
  try {
    await connectDB();

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: 'Super Admin artıq mövcuddur!',
        email: existingSuperAdmin.email 
      });
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    const superAdmin = await User.create({
      email: 'superadmin@loyal.az',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'super_admin',
      tenantId: null,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Super Admin uğurla yaradıldı!',
      credentials: {
        email: 'superadmin@loyal.az',
        password: 'Admin123!',
      },
      user: {
        id: superAdmin._id,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role,
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Xəta baş verdi' 
    }, { status: 500 });
  }
}