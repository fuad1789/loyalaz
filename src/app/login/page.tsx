'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email və şifrə daxil edin');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email və ya şifrə yanlışdır');
      } else {
        toast.success('Uğurla daxil oldunuz!');
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      toast.error('Xəta baş verdi. Yenidən cəhd edin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Loyal.az</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Xoş gəlmisiniz!</h1>
          <p className="text-gray-600">Hesabınıza daxil olun</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <form onSubmit={handleSubmit} autoComplete="off" data-lpignore="true">
            {/* Fake hidden fields to trick browsers */}
            <input type="text" name="prevent_autocomplete_username" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="password" name="prevent_autocomplete_password" className="hidden" tabIndex={-1} autoComplete="new-password" />
            
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={(e) => {
                    setEmailFocused(true);
                    e.target.removeAttribute('readonly');
                  }}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="email@example.com"
                  name="email_unique_field"
                  id="email_login_unique"
                  readOnly
                  data-form-type="other"
                  data-lpignore="true"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifrə
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => {
                    setPasswordFocused(true);
                    e.target.removeAttribute('readonly');
                  }}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  name="password_unique_field"
                  id="password_login_unique"
                  readOnly
                  data-form-type="other"
                  data-lpignore="true"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Yüklənir...
                </>
              ) : (
                'Daxil ol'
              )}
            </button>
          </form>
        </div>

        {/* Help text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Hesabınız yoxdur?{' '}
          <Link href="/" className="text-primary-500 hover:text-primary-600 font-medium">
            Əlaqə saxlayın
          </Link>
        </p>
      </div>
    </div>
  );
}