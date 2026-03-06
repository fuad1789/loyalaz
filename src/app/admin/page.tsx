'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  LogOut,
  TrendingUp,
  Gift,
  QrCode,
  Plus,
  Printer,
  BarChart3,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Stats {
  totalCards: number;
  activeCards: number;
  totalPoints: number;
  totalRewards: number;
  recentTransactions: Transaction[];
  chartData: { date: string; points: number }[];
}

interface Transaction {
  _id: string;
  actionType: string;
  createdAt: string;
  cardId: { uuid: string };
  staffId: { name: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      toast.error('Statistikaları yükləmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pieData = stats ? [
    { name: 'Aktiv', value: stats.activeCards, color: '#10b981' },
    { name: 'Passiv', value: stats.totalCards - stats.activeCards, color: '#e5e7eb' },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Loyal.az</span>
        </div>

        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            İdarə Paneli
          </Link>
          <Link href="/admin/cards" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <CreditCard className="w-5 h-5" />
            Kartlar
          </Link>
          <Link href="/admin/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Users className="w-5 h-5" />
            Əməkdaşlar
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Çıxış
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İdarə Paneli</h1>
            <p className="text-gray-500">Biznesinizin vəziyyətinə nəzər salın</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/cards" 
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Kart Yarat
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Cəmi</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalCards || 0}</p>
            <p className="text-gray-500 text-sm">Kartlar</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm text-emerald-500">Aktiv</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.activeCards || 0}</p>
            <p className="text-gray-500 text-sm">Aktiv Kartlar</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">Xallar</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalPoints || 0}</p>
            <p className="text-gray-500 text-sm">Verilən Xallar</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-500">Hədiyyələr</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalRewards || 0}</p>
            <p className="text-gray-500 text-sm">Verilən Hədiyyələr</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xal Artımı</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="points" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ fill: '#0ea5e9', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kart Statusu</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-600">Aktiv ({stats?.activeCards})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-sm text-gray-600">Passiv ({stats?.totalCards! - stats?.activeCards!})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Əməliyyatlar</h3>
          
          {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                    <th className="pb-3">Kart</th>
                    <th className="pb-3">Əməliyyat</th>
                    <th className="pb-3">Əməkdaş</th>
                    <th className="pb-3">Tarix</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((tx) => (
                    <tr key={tx._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {tx.cardId?.uuid?.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.actionType === 'activation' ? 'bg-blue-100 text-blue-700' :
                          tx.actionType === 'point_added' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {tx.actionType === 'activation' ? 'Aktivləşmə' :
                           tx.actionType === 'point_added' ? 'Xal əlavə edildi' :
                           'Hədiyyə verildi'}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">{tx.staffId?.name || '-'}</td>
                      <td className="py-4 text-gray-500 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString('az-AZ', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Hələ əməliyyat yoxdur</p>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
          <div className="flex items-center justify-around">
            <Link href="/admin" className="flex flex-col items-center text-primary-600">
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-xs mt-1">Panel</span>
            </Link>
            <Link href="/admin/cards" className="flex flex-col items-center text-gray-400">
              <CreditCard className="w-6 h-6" />
              <span className="text-xs mt-1">Kartlar</span>
            </Link>
            <Link href="/admin/staff" className="flex flex-col items-center text-gray-400">
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">Əməkdaşlar</span>
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}