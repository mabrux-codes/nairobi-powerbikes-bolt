import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Bike, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (mode === 'signin') {
      const { error } = await signIn(form.email, form.password);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      if (!form.full_name || !form.phone) { setError('Please fill in all fields.'); setLoading(false); return; }
      const { error } = await signUp(form.email, form.password, form.full_name, form.phone);
      if (error) { setError(error.message); setLoading(false); return; }
    }
    navigate('/dashboard');
  }

  return (
    <main className="bg-[#0a0a0a] min-h-screen flex">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 to-[#0a0a0a]/40" />

        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <Link to="/" className="flex items-center gap-3 mb-auto mt-8">
            <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Bike className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <span className="block text-white font-display font-black tracking-wider text-lg leading-tight">NAIROBI</span>
              <span className="block font-display font-bold text-[10px] tracking-[0.3em] text-red-500 leading-tight">POWERBIKES</span>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl font-display font-black text-white mb-3 leading-tight tracking-wide">
              Your Gateway to<br />Premium Riding
            </h2>
            <p className="font-body text-gray-400 text-lg">
              Create an account to save your favourite bikes, book test rides, and manage your inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Bike className="w-5 h-5 text-white relative z-10" />
            </div>
            <div>
              <span className="block text-white font-display font-black tracking-wider text-base leading-tight">NAIROBI</span>
              <span className="block font-display font-bold text-[10px] tracking-[0.3em] text-red-500 leading-tight">POWERBIKES</span>
            </div>
          </Link>

          {/* Heading */}
          <h1 className="font-display text-3xl font-black text-white mb-2 tracking-wider">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="font-body text-gray-400 mb-8">
            {mode === 'signin' ? 'Sign in to your account to continue.' : 'Join the Nairobi Powerbikes community.'}
          </p>

          {/* Toggle */}
          <div className="flex bg-[#111] rounded-xl p-1 mb-8 border border-white/5">
            <button
              onClick={() => setMode('signin')}
              className={`font-display flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'signin' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`font-display flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'signup' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs text-gray-400 font-display font-semibold uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="John Doe"
                    className="input-premium font-body"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-display font-semibold uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+254 700 000 000"
                    className="input-premium font-body"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs text-gray-400 font-display font-semibold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-premium font-body"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 font-display font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="--------"
                  minLength={6}
                  className="input-premium font-body pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Footer Links */}
          <p className="font-body text-center text-xs text-gray-600 mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>.
          </p>
          <p className="text-center text-xs text-gray-700 mt-4">
            <Link
              to="/admin/auth"
              className="text-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-1"
            >
              <Shield className="w-3 h-3" /> Admin? Sign in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
