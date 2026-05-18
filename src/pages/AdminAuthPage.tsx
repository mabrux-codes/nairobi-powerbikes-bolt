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

    setLoading(false);
  }

  return (
    <main className="bg-neutral-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600/20 border border-red-600/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">Sign in with your admin credentials to manage the platform.</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-600/10 border border-red-600/20 rounded-xl text-red-400 text-xs font-semibold mb-6">
            <Lock className="w-3.5 h-3.5" />
            Restricted area — authorized personnel only
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                <Mail className="w-3 h-3 inline mr-1" /> Admin Email
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@nairobipowerbikes.co.ke"
                className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                <Lock className="w-3 h-3 inline mr-1" /> Password
              </label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="--------" minLength={6}
                  className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-red-500 transition-colors pr-12" />
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
              className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authenticating...</>
              ) : (
                <><Shield className="w-4 h-4" />Access Admin Panel</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
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
