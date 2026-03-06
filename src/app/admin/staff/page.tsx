'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  CreditCard, 
  Users, 
  Plus,
  X,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  QrCode,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Staff {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  stats?: {
    scans: number;
    rewards: number;
  };
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/admin/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (error) {
      toast.error('Əməkdaşları yükləmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/staff', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Əməkdaş uğurla əlavə edildi!');
        setFormData({ name: '', email: '', password: '' });
        setShowAddModal(false);
        fetchStaff();
      } else {
        toast.error(data.error || 'Xəta baş verdi');
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <CreditCard className="w-5 h-5" />
            İdarə Paneli
          </Link>
          <Link href="/admin/cards" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <CreditCard className="w-5 h-5" />
            Kartlar
          </Link>
          <Link href="/admin/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-600 font-medium">
            <Users className="w-5 h-5" />
            Əməkdaşlar
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Əməkdaşlar</h1>
            <p className="text-gray-500">Ofisiant və işçiləri idarə edin</p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Əməkdaş Əlavə Et
          </button>
        </div>

        {/* Staff Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : staff.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hələ əməkdaş yoxdur</h3>
            <p className="text-gray-500 mb-6">İlk əməkdaşınızı əlavə edin</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Əməkdaş Əlavə Et
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div 
                key={member._id} 
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                      <QrCode className="w-4 h-4" />
                      <span className="text-xl font-bold">{member.stats?.scans || 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">Skand edilmə</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-xl font-bold">{member.stats?.rewards || 0}</span>
                    </div>
                    <p className="text-xs text-gray-500">Hədiyyə</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Yeni Əməkdaş</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" data-lpignore="true">
              {/* Fake hidden fields to trick browsers */}
              <input type="text" name="prevent_autocomplete_username" className="hidden" tabIndex={-1} autoComplete="off" />
              <input type="password" name="prevent_autocomplete_password" className="hidden" tabIndex={-1} autoComplete="new-password" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  placeholder="Məsələn: Əli Məmmədov"
                  name="staff_name_unique"
                  readOnly
                  data-lpignore="true"
                  data-form-type="other"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    placeholder="email@example.com"
                    name="staff_email_unique"
                    readOnly
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifrə
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    placeholder="••••••••"
                    name="staff_password_unique"
                    readOnly
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  İmtina
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Əlavə edilir...
                    </>
                  ) : (
                    'Əlavə Et'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
        <div className="flex items-center justify-around">
          <Link href="/admin" className="flex flex-col items-center text-gray-400">
            <CreditCard className="w-6 h-6" />
            <span className="text-xs mt-1">Panel</span>
          </Link>
          <Link href="/admin/cards" className="flex flex-col items-center text-gray-400">
            <CreditCard className="w-6 h-6" />
            <span className="text-xs mt-1">Kartlar</span>
          </Link>
          <Link href="/admin/staff" className="flex flex-col items-center text-primary-600">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Əməkdaşlar</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}