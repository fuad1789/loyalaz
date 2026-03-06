'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Building2, Users, CreditCard, Activity, Plus, MoreVertical, 
  Edit, Trash2, Ban, CheckCircle, XCircle, TrendingUp, Calendar,
  Search, Filter, Download, RefreshCw, Eye, Power, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Tenant {
  _id: string;
  name: string;
  pointThreshold: number;
  isActive: boolean;
  plan: 'Sadə' | 'Populyar' | 'Korporativ';
  createdAt: string;
  cardStats?: {
    total: number;
    active: number;
  };
}

interface PlatformStats {
  totalTenants: number;
  totalCards: number;
  activeCards: number;
  totalTransactions: number;
}

export default function SuperAdminPanel() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalTenants: 0,
    totalCards: 0,
    activeCards: 0,
    totalTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    pointThreshold: 6,
    plan: 'Sadə' as 'Sadə' | 'Populyar' | 'Korporativ',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch tenants
      const tenantsRes = await fetch('/api/tenants');
      if (tenantsRes.ok) {
        const tenantsData = await tenantsRes.json();
        setTenants(tenantsData);
      }

      // Fetch platform stats
      const statsRes = await fetch('/api/super-admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      toast.error('Məlumatları yükləmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Restoran uğurla yaradıldı!');
        setShowCreateModal(false);
        setFormData({
          name: '',
          pointThreshold: 6,
          plan: 'Sadə',
          adminName: '',
          adminEmail: '',
          adminPassword: '',
        });
        fetchData();
      } else {
        toast.error(data.error || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tenants/${selectedTenant._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          pointThreshold: formData.pointThreshold,
          plan: formData.plan,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast.success('Restoran məlumatları yeniləndi!');
        setShowEditModal(false);
        setSelectedTenant(null);
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (tenant: Tenant) => {
    try {
      const newStatus = !tenant.isActive;
      const response = await fetch(`/api/tenants/${tenant._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: newStatus }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || (newStatus 
          ? 'Restoran aktivləşdirildi!' 
          : 'Restoran donduruldu!'
        ));
        // Optimistically update the local state
        setTenants(prev => prev.map(t => 
          t._id === tenant._id ? { ...t, isActive: newStatus } : t
        ));
      } else {
        toast.error(data.error || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleDeleteTenant = async () => {
    if (!selectedTenant) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/tenants/${selectedTenant._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Restoran silindi!');
        setShowDeleteModal(false);
        setSelectedTenant(null);
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      pointThreshold: tenant.pointThreshold,
      plan: tenant.plan,
      adminName: '',
      adminEmail: '',
      adminPassword: '',
    });
    setShowEditModal(true);
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && tenant.isActive) ||
      (filterStatus === 'suspended' && !tenant.isActive);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'Populyar': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'Korporativ': return 'bg-gradient-to-r from-violet-500 to-purple-500 text-white';
      default: return 'bg-slate-600 text-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Super Admin</h1>
                <p className="text-slate-400 text-sm">Komand Mərkəzi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Yeni Restoran Əlavə Et
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tenants */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalTenants}</div>
            <div className="text-slate-400 text-sm">Ümumi Restoranlar</div>
          </div>

          {/* Total Cards */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-violet-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+28%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalCards}</div>
            <div className="text-slate-400 text-sm">Sistemdəki Ümumi Kartlar</div>
          </div>

          {/* Active Cards */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+18%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.activeCards}</div>
            <div className="text-slate-400 text-sm">Aktiv İstifadəçilər</div>
          </div>

          {/* Total Transactions */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+45%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalTransactions}</div>
            <div className="text-slate-400 text-sm">Ümumi Tranzaksiyalar</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Restoran axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-slate-500 outline-none transition-all"
            >
              <option value="all">Bütün Planlar</option>
              <option value="Sadə">Sadə</option>
              <option value="Populyar">Populyar</option>
              <option value="Korporativ">Korporativ</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-slate-500 outline-none transition-all"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="active">Aktiv</option>
              <option value="suspended">Dondurulub</option>
            </select>
          </div>
        </div>

        {/* Tenant Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Restoran Adı</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Qeydiyyat Tarixi</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Xal Həddi</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Kart Statistikası</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                        <span className="text-slate-400">Yüklənir...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Building2 className="w-12 h-12 text-slate-600" />
                        <span className="text-slate-400">Restoran tapılmadı</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((tenant) => (
                    <tr 
                      key={tenant._id} 
                      className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                            {tenant.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{tenant.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          {new Date(tenant.createdAt).toLocaleDateString('az-AZ')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300">{tenant.pointThreshold} xal</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getPlanBadgeColor(tenant.plan)}`}>
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{tenant.cardStats?.total || 0}</span>
                          <span className="text-slate-500">/</span>
                          <span className="text-emerald-400">{tenant.cardStats?.active || 0}</span>
                          <span className="text-slate-500 text-sm">aktiv</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tenant.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Aktiv
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            Dondurulub
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(tenant)}
                            className={`p-2 rounded-lg transition-colors ${
                              tenant.isActive 
                                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' 
                                : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                            title={tenant.isActive ? 'Dondur' : 'Aktivləşdir'}
                          >
                            <Power className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(tenant)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="Redaktə et"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTenant(tenant);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Tenant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Yeni Restoran Əlavə Et
              </h2>
            </div>
            
            <form onSubmit={handleCreateTenant} className="p-6 space-y-5" autoComplete="off" data-lpignore="true">
              <input type="text" name="prevent_autocomplete_username" className="hidden" tabIndex={-1} autoComplete="off" />
              <input type="password" name="prevent_autocomplete_password" className="hidden" tabIndex={-1} autoComplete="new-password" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Restoran Adı</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    placeholder="Məsələn: Café Lala"
                    name="tenant_name_unique"
                    readOnly
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Xal Həddi</label>
                  <input
                    type="number"
                    value={formData.pointThreshold}
                    onChange={(e) => setFormData({ ...formData, pointThreshold: parseInt(e.target.value) })}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    min={1}
                    max={20}
                    name="tenant_threshold_unique"
                    readOnly
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Abunəlik Planı</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="Sadə">Sadə</option>
                    <option value="Populyar">Populyar</option>
                    <option value="Korporativ">Korporativ</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-4">Admin Hesabı</h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    placeholder="Admin adı"
                    name="admin_name_unique"
                    readOnly
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    required
                  />
                  
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    placeholder="admin@email.com"
                    name="admin_email_unique"
                    readOnly
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    required
                  />
                  
                  <input
                    type="password"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    placeholder="Şifrə"
                    name="admin_password_unique"
                    readOnly
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      name: '',
                      pointThreshold: 6,
                      plan: 'Sadə',
                      adminName: '',
                      adminEmail: '',
                      adminPassword: '',
                    });
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Yaradılır...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Yarat
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditModal && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                Restoranı Redaktə Et
              </h2>
            </div>
            
            <form onSubmit={handleEditTenant} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Restoran Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Xal Həddi</label>
                  <input
                    type="number"
                    value={formData.pointThreshold}
                    onChange={(e) => setFormData({ ...formData, pointThreshold: parseInt(e.target.value) })}
                    min={1}
                    max={20}
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Abunəlik Planı</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="Sadə">Sadə</option>
                    <option value="Populyar">Populyar</option>
                    <option value="Korporativ">Korporativ</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTenant(null);
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Yenilənir...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Yenilə
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-2">
                Restoranı Silmək İstəyirsiniz?
              </h2>
              <p className="text-slate-400 mb-2">
                <span className="text-white font-medium">{selectedTenant.name}</span> restoranını silmək istədiyinizə əminsiniz?
              </p>
              <p className="text-red-400 text-sm mb-6">
                Bu əməliyyat geri qaytarıla bilməz. Bütün kartlar və tranzaksiyalar silinəcək.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedTenant(null);
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  onClick={handleDeleteTenant}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Silinir...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Sil
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx global>{`
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}