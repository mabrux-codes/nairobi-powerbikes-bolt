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

  // If already logged in, redirect to appropriate dashboard
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
    <main className="bg-zinc-950 min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-zinc-950/30" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <Link to="/" className="flex items-center gap-2 mb-auto mt-8">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"><Bike className="w-6 h-6 text-white" /></div>
            <div><span className="block text-white font-black text-lg leading-tight">NAIROBI</span><span className="block text-blue-400 font-bold text-xs tracking-[0.2em] leading-tight">POWERBIKES</span></div>
          </Link>
          <div>
            <h2 className="text-4xl font-black text-white mb-3 leading-tight">Your Gateway to<br />Premium Riding</h2>
            <p className="text-gray-400 text-lg">Create an account to save your favourite bikes, book test rides, and manage your inquiries.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center"><Bike className="w-5 h-5 text-white" /></div>
            <span className="text-white font-black text-base">NAIROBI POWERBIKES</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-gray-400 mb-8">{mode === 'signin' ? 'Sign in to your account to continue.' : 'Join the Nairobi Powerbikes community.'}</p>

          <div className="flex bg-zinc-900 rounded-xl p-1 mb-8">
            <button onClick={() => setMode('signin')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'signin' ? 'bg-blue-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Sign In</button>
            <button onClick={() => setMode('signup')} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'signup' ? 'bg-blue-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Create Account</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Phone Number</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 700 000 000"
                    className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="--------" minLength={6}
                  className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500 pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</> : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-6">
            By continuing, you agree to our <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>.
          </p>
          <p className="text-center text-xs text-gray-700 mt-4">
            <Link to="/admin/auth" className="text-gray-600 hover:text-gray-400 transition-colors flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Admin? Sign in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
