import React, { useState } from 'react';
import { LogoBadge } from './LogoBadge';
import { SpecialThanksModal } from './SpecialThanksModal';
import { Lock, User, Eye, EyeOff, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThanksModalOpen, setIsThanksModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Harap isi username dan password.');
      return;
    }

    setIsLoading(true);

    // Simulate snappy authentication
    setTimeout(() => {
      if (cleanUser === 'kuranji' && cleanPass === 'kuranji') {
        if (rememberMe) {
          localStorage.setItem('ingek_bundo_auth', JSON.stringify({ user: 'kuranji', time: Date.now() }));
        } else {
          sessionStorage.setItem('ingek_bundo_auth', JSON.stringify({ user: 'kuranji', time: Date.now() }));
        }
        setIsLoading(false);
        onLoginSuccess('kuranji');
      } else {
        setIsLoading(false);
        setErrorMsg('Username atau password salah. Silakan coba lagi.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] via-[#FFF9FA] to-[#F0FDF4] flex flex-col justify-between items-center p-4 sm:p-6 select-none">
      {/* Top Decoration */}
      <div className="w-full max-w-md pt-4 sm:pt-8 flex justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-pink-200/80 text-xs font-semibold text-gray-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Resmi Puskesmas Kuranji Kota Padang</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-white rounded-3xl border border-pink-100/90 shadow-xl shadow-pink-500/5 p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-emerald-200 shadow-sm">
              <LogoBadge size="lg" allowUpload={false} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide flex items-center justify-center gap-1 font-heading">
                <span className="text-[#E62E76] drop-shadow-xs">INGEK</span>
                <span className="text-[#15805D] flex items-center">
                  BUNDO
                  <button
                    type="button"
                    onClick={() => setIsThanksModalOpen(true)}
                    className="inline-flex items-center p-1 -m-1 rounded-full hover:bg-pink-100/60 transition-transform active:scale-90 cursor-pointer"
                    title="Klik untuk melihat pesan rahasia"
                    aria-label="Pesan Terima Kasih"
                  >
                    <Heart size={18} className="fill-[#E62E76] text-[#E62E76] animate-pulse hover:scale-125 transition-transform" />
                  </button>
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">
                Aplikasi Pemantauan &amp; Presensi Kelas Ibu Hamil
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Puskesmas Kuranji · Khusus Petugas Kesehatan dan Kader
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User size={17} />
                </div>
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#E62E76] focus:ring-2 focus:ring-pink-100 text-sm font-medium text-gray-900 placeholder:text-gray-500 transition-all outline-hidden"
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock size={17} />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-[#E62E76] focus:ring-2 focus:ring-pink-100 text-sm font-medium text-gray-900 placeholder:text-gray-500 transition-all outline-hidden"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#E62E76] focus:ring-[#E62E76]"
                />
                <span>Ingat sesi masuk</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#E62E76] to-[#F43F5E] hover:from-[#D41A63] hover:to-[#E11D48] transition-all cursor-pointer shadow-md shadow-pink-500/20 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-600 font-medium">
            <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
            <span>Koneksi Aman (HTTPS) &amp; Bebas Indeks Google</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md pb-4 text-center text-xs text-gray-600 font-medium">
        &copy; {new Date().getFullYear()} Ingek Bundo · Puskesmas Kuranji Kota Padang
      </footer>

      {/* Special Thanks Popup Modal */}
      <SpecialThanksModal
        isOpen={isThanksModalOpen}
        onClose={() => setIsThanksModalOpen(false)}
      />
    </div>
  );
};
