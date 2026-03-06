import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Card, Transaction, Tenant } from '@/lib/models';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'İcazə yoxdur' }, { status: 401 });
    }

    await connectDB();
    const tenantId = session.user.tenantId;

    // Get basic stats
    const totalCards = await Card.countDocuments({ tenantId });
    const activeCards = await Card.countDocuments({ tenantId, status: 'active' });
    
    // Get total points given
    const pointsResult = await Transaction.aggregate([
      { $match: { tenantId: tenantId, actionType: { $in: ['activation', 'point_added'] } } },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);
    const totalPoints = pointsResult[0]?.total || 0;

    // Get total rewards
    const rewardsResult = await Transaction.aggregate([
      { $match: { tenantId: tenantId, actionType: 'reward' } },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);
    const totalRewards = rewardsResult[0]?.total || 0;

    // Get recent transactions
    const recentTransactions = await Transaction.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('cardId', 'uuid')
      .populate('staffId', 'name');

    // Get chart data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const chartData = await Transaction.aggregate([
      { 
        $match: { 
          tenantId: tenantId, 
          actionType: { $in: ['activation', 'point_added'] },
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d/%m', date: '$createdAt' } },
          points: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedChartData = chartData.map(item => ({
      date: item._id,
      points: item.points
    }));

    return NextResponse.json({
      totalCards,
      activeCards,
      totalPoints,
      totalRewards,
      recentTransactions: JSON.parse(JSON.stringify(recentTransactions)),
      chartData: formattedChartData
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Xəta baş verdi' }, { status: 500 });
  }
}