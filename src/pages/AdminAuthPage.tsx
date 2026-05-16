import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminAuthPage() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin, redirect
  if (user && isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Auth state change will trigger re-render; the isAdmin check
    // depends on user.app_metadata.role being set to 'admin'.
    // If not admin, show error.
    setLoading(false);
  }

  return (
    <main className="bg-zinc-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">Sign in with your admin credentials to manage the platform.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-xs font-semibold mb-6">
            <Lock className="w-3.5 h-3.5" />
            Restricted area — authorized personnel only
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                <Mail className="w-3 h-3 inline mr-1" /> Admin Email
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@nairobipowerbikes.co.ke"
                className="w-full px-4 py-3.5 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-yellow-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3 inline mr-1" /> Password
              </label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="--------" minLength={6}
                  className="w-full px-4 py-3.5 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-yellow-500 transition-colors pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-500/50 text-zinc-900 font-black rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />Authenticating...</>
              ) : (
                <><Shield className="w-4 h-4" />Access Admin Panel</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
            <p className="text-gray-500 text-xs mb-3">Not an admin?</p>
            <Link to="/auth" className="text-sm text-gray-400 hover:text-white font-semibold transition-colors">
              Sign in as a customer instead
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
