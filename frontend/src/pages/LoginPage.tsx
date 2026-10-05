import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Users, Globe } from 'lucide-react';
import Logo from '../components/branding/Logo';
import BrandDisclaimer from '../components/branding/BrandDisclaimer';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [email, setEmail] = useState('vikram.singh@returnhome.gov.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const roleOptions: { role: UserRole; title: string; email: string; icon: any }[] = [
    {
      role: 'Admin',
      title: 'Law Enforcement Lead / Admin',
      email: 'admin@returnhome.gov.in',
      icon: ShieldCheck
    },
    {
      role: 'Investigator',
      title: 'Investigator / Field Analyst',
      email: 'investigator@returnhome.gov.in',
      icon: UserCheck
    },
    {
      role: 'Viewer',
      title: 'Public Citizen / Reporter',
      email: 'citizen@returnhome.org',
      icon: Globe
    }
  ];

  const [error, setError] = useState<string>('');

  const handleRoleSelect = (roleItem: typeof roleOptions[0]) => {
    setSelectedRole(roleItem.role);
    setEmail(roleItem.email);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password, selectedRole);
      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    loginWithGoogle({
      name: 'Inspector Vikram Singh (Google)',
      email: 'vikram.singh.official@gmail.com',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo Container */}
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo variant="full" theme="dark" size="xl" showTagline={true} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white pt-2">
            ReturnHome Portal Sign In
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select your role context or sign in with Google to access missing-person case management & visual AI investigation.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 grid grid-cols-3 gap-1 shadow-lg">
          {roleOptions.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => handleRoleSelect(item)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-bold leading-tight text-center">{item.role}</span>
              </button>
            );
          })}
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-md flex items-center justify-center gap-3 transition-colors border border-slate-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.01-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.6l4.01 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google Account</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] uppercase font-bold text-slate-500">Or email credentials</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Official Email Address ({selectedRole} Mode)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@returnhome.gov.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Remember session</span>
              </label>
              <a href="#forgot" className="text-cyan-400 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-cyan-900/40 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Disclaimer */}
        <BrandDisclaimer variant="compact" />

        <div className="text-center text-xs text-slate-400">
          Need a ReturnHome agency profile?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Register new profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
