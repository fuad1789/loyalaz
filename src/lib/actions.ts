'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import connectDB from './db';
import { Tenant, User, Card, Transaction } from './models';
import { auth } from './auth';

// Super Admin Actions
export async function createTenant(formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== 'super_admin') {
    return { error: 'İcazə yoxdur' };
  }

  const name = formData.get('name') as string;
  const pointThreshold = parseInt(formData.get('pointThreshold') as string) || 6;
  const adminEmail = formData.get('adminEmail') as string;
  const adminPassword = formData.get('adminPassword') as string;
  const adminName = formData.get('adminName') as string;

  if (!name || !adminEmail || !adminPassword || !adminName) {
    return { error: 'Bütün sahələri doldurun' };
  }

  try {
    await connectDB();

    // Check if email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return { error: 'Bu email artıq istifadə olunur' };
    }

    // Create tenant
    const tenant = await Tenant.create({
      name,
      pointThreshold,
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

    revalidatePath('/secret-super-panel');
    return { success: true, message: 'Tenant uğurla yaradıldı' };
  } catch (error) {
    console.error('Create tenant error:', error);
    return { error: 'Xəta baş verdi. Yenidən cəhd edin' };
  }
}

export async function getTenants() {
  const session = await auth();
  
  if (!session || session.user.role !== 'super_admin') {
    return [];
  }

  try {
    await connectDB();
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(tenants));
  } catch (error) {
    console.error('Get tenants error:', error);
    return [];
  }
}

// Tenant Admin Actions
export async function generateCards(quantity: number) {
  const session = await auth();
  
  if (!session || session.user.role !== 'tenant_admin' || !session.user.tenantId) {
    return { error: 'İcazə yoxdur' };
  }

  if (quantity < 1 || quantity > 500) {
    return { error: '1-500 arası kart sayı daxil edin' };
  }

  try {
    await connectDB();

    const cards = [];
    for (let i = 0; i < quantity; i++) {
      cards.push({
        uuid: uuidv4(),
        tenantId: session.user.tenantId,
        status: 'inactive',
        currentPoints: 0,
        totalRedemptions: 0,
        lastScannedAt: null,
      });
    }

    await Card.insertMany(cards);
    revalidatePath('/admin/cards');
    return { success: true, message: `${quantity} kart uğurla yaradıldı`, count: quantity };
  } catch (error) {
    console.error('Generate cards error:', error);
    return { error: 'Xəta baş verdi. Yenidən cəhd edin' };
  }
}

export async function getCards() {
  const session = await auth();
  
  if (!session || !session.user.tenantId) {
    return [];
  }

  try {
    await connectDB();
    const cards = await Card.find({ tenantId: session.user.tenantId })
      .sort({ createdAt: -1 })
      .limit(100);
    return JSON.parse(JSON.stringify(cards));
  } catch (error) {
    console.error('Get cards error:', error);
    return [];
  }
}

export async function getTenantStats() {
  const session = await auth();
  
  if (!session || !session.user.tenantId) {
    return null;
  }

  try {
    await connectDB();
    
    const tenantId = session.user.tenantId;
    
    const totalCards = await Card.countDocuments({ tenantId });
    const activeCards = await Card.countDocuments({ tenantId, status: 'active' });
    const inactiveCards = await Card.countDocuments({ tenantId, status: 'inactive' });
    
    const pointsAggregation = await Card.aggregate([
      { $match: { tenantId: tenantId } },
      { $group: { _id: null, totalPoints: { $sum: '$currentPoints' } } },
    ]);
    const totalPoints = pointsAggregation[0]?.totalPoints || 0;
    
    const redemptionsAggregation = await Card.aggregate([
      { $match: { tenantId: tenantId } },
      { $group: { _id: null, totalRedemptions: { $sum: '$totalRedemptions' } } },
    ]);
    const totalRedemptions = redemptionsAggregation[0]?.totalRedemptions || 0;
    
    // Get today's scans
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactions = await Transaction.countDocuments({
      tenantId,
      createdAt: { $gte: today },
    });

    // Get last 7 days data for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const lastWeekTransactions = await Transaction.aggregate([
      { $match: { tenantId, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      totalCards,
      activeCards,
      inactiveCards,
      totalPoints,
      totalRedemptions,
      todayTransactions,
      lastWeekTransactions,
    };
  } catch (error) {
    console.error('Get stats error:', error);
    return null;
  }
}

// Staff Management
export async function createStaff(formData: FormData) {
  const session = await auth();
  
  if (!session || session.user.role !== 'tenant_admin' || !session.user.tenantId) {
    return { error: 'İcazə yoxdur' };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Bütün sahələri doldurun' };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Bu email artıq istifadə olunur' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'staff',
      tenantId: session.user.tenantId,
    });

    revalidatePath('/admin/staff');
    return { success: true, message: 'Əməkdaş uğurla yaradıldı' };
  } catch (error) {
    console.error('Create staff error:', error);
    return { error: 'Xəta baş verdi. Yenidən cəhd edin' };
  }
}

export async function getStaff() {
  const session = await auth();
  
  if (!session || !session.user.tenantId) {
    return [];
  }

  try {
    await connectDB();
    
    const staff = await User.find({
      tenantId: session.user.tenantId,
      role: 'staff',
    }).sort({ createdAt: -1 });

    // Get transaction counts for each staff
    const staffWithStats = await Promise.all(
      staff.map(async (s) => {
        const transactionCount = await Transaction.countDocuments({ staffId: s._id });
        return {
          ...s.toObject(),
          transactionCount,
        };
      })
    );

    return JSON.parse(JSON.stringify(staffWithStats));
  } catch (error) {
    console.error('Get staff error:', error);
    return [];
  }
}

// Scan Actions
export async function scanCard(uuid: string) {
  const session = await auth();
  
  if (!session || session.user.role !== 'staff' || !session.user.tenantId) {
    return { error: 'İcazə yoxdur' };
  }

  try {
    await connectDB();

    const card = await Card.findOne({ uuid });

    if (!card) {
      return { error: 'Kart tapılmadı' };
    }

    if (card.tenantId.toString() !== session.user.tenantId) {
      return { error: 'Bu kart bu restorana aid deyil' };
    }

    // Check cooldown (12 hours)
    if (card.lastScannedAt) {
      const lastScan = new Date(card.lastScannedAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastScan.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 12 && card.status === 'active') {
        return { error: 'Bu karta son 12 saat ərzində xal vurulub' };
      }
    }

    // Get tenant settings
    const tenant = await Tenant.findById(session.user.tenantId);
    if (!tenant) {
      return { error: 'Restoran tapılmadı' };
    }

    const pointsBefore = card.currentPoints;

    // Handle inactive card - activation
    if (card.status === 'inactive') {
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
        pointsBefore: 0,
        pointsAfter: 1,
      });

      return {
        success: true,
        action: 'activation',
        message: 'Kart aktivləşdirildi! 1 xal əlavə edildi',
        currentPoints: 1,
        pointsThreshold: tenant.pointThreshold,
      };
    }

    // Handle active card - add point or redeem
    const newPoints = card.currentPoints + 1;

    if (newPoints >= tenant.pointThreshold) {
      // Ready for redemption
      return {
        success: true,
        action: 'ready_for_redemption',
        message: `Təbrik edirik! ${tenant.pointThreshold} xal toplandı. Hədiyyəni təqdim edin!`,
        currentPoints: card.currentPoints,
        pointsThreshold: tenant.pointThreshold,
        needsRedemption: true,
      };
    }

    // Add point
    card.currentPoints = newPoints;
    card.lastScannedAt = new Date();
    await card.save();

    // Create transaction
    await Transaction.create({
      cardId: card._id,
      tenantId: session.user.tenantId,
      staffId: session.user.id,
      actionType: 'point_added',
      pointsBefore,
      pointsAfter: newPoints,
    });

    return {
      success: true,
      action: 'point_added',
      message: `1 xal əlavə edildi! Cəmi: ${newPoints}/${tenant.pointThreshold}`,
      currentPoints: newPoints,
      pointsThreshold: tenant.pointThreshold,
    };
  } catch (error) {
    console.error('Scan card error:', error);
    return { error: 'Xəta baş verdi. Yenidən cəhd edin' };
  }
}

export async function redeemReward(uuid: string) {
  const session = await auth();
  
  if (!session || session.user.role !== 'staff' || !session.user.tenantId) {
    return { error: 'İcazə yoxdur' };
  }

  try {
    await connectDB();

    const card = await Card.findOne({ uuid });

    if (!card) {
      return { error: 'Kart tapılmadı' };
    }

    const tenant = await Tenant.findById(session.user.tenantId);
    if (!tenant) {
      return { error: 'Restoran tapılmadı' };
    }

    const pointsBefore = card.currentPoints;

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
      pointsBefore,
      pointsAfter: 0,
    });

    return {
      success: true,
      message: 'Hədiyyə təsdiqləndi! Xallar sıfırlandı',
      currentPoints: 0,
      totalRedemptions: card.totalRedemptions,
    };
  } catch (error) {
    console.error('Redeem reward error:', error);
    return { error: 'Xəta baş verdi. Yenidən cəhd edin' };
  }
}

// Customer View
export async function getCardByUUID(uuid: string) {
  try {
    await connectDB();

    const card = await Card.findOne({ uuid }).populate('tenantId');

    if (!card) {
      return null;
    }

    const tenant = card.tenantId as any;

    return {
      uuid: card.uuid,
      status: card.status,
      currentPoints: card.currentPoints,
      totalRedemptions: card.totalRedemptions,
      tenant: {
        name: tenant.name,
        pointThreshold: tenant.pointThreshold,
      },
    };
  } catch (error) {
    console.error('Get card error:', error);
    return null;
  }
}

// Authentication
export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) {
    return { error: 'Bütün sahələri doldurun' };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Bu email artıq istifadə olunur' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // First user becomes super admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'super_admin' : 'staff';

    await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      tenantId: null,
    });

    return { success: true, message: 'Qeydiyyat uğurla tamamlandı' };
  } catch (error) {
    console.error('Register error:', error);
    return { error: 'Xəta baş verdi. Yenidən cəhd edin' };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email və şifrə daxil edin' };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Email və ya şifrə yanlışdır' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Email və ya şifrə yanlışdır' };
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Xəta baş verdi. Yenidən cəhd edin' };
  }
}