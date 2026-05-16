import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { User, Heart, Calendar, MessageSquare, LogOut, Settings, ChevronRight, Bike, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const sideNav = [
  { to: '/dashboard', label: 'Overview', icon: User, end: true },
  { to: '/dashboard/wishlist', label: 'Saved Bikes', icon: Heart },
  { to: '/dashboard/bookings', label: 'Test Ride Bookings', icon: Calendar },
  { to: '/dashboard/inquiries', label: 'My Inquiries', icon: MessageSquare },
  { to: '/dashboard/profile', label: 'Profile Settings', icon: Settings },
];

export default function CustomerDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/auth'); }, [user, navigate]);

  async function handleSignOut() { await signOut(); navigate('/'); }

  if (!user) return null;

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Customer Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-white font-black text-sm leading-tight">NAIROBI</span>
                <span className="block text-blue-400 font-bold text-[10px] tracking-[0.15em] leading-tight">POWERBIKES</span>
              </div>
            </Link>
            <span className="hidden sm:block text-gray-500 text-xs ml-2 pl-2 border-l border-zinc-700">My Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 bg-zinc-800 rounded-lg">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
            </Link>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-2 bg-red-500/10 rounded-lg">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 font-black text-xl">
                  {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold">{profile?.full_name || 'Welcome!'}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {sideNav.map(({ to, label, icon: Icon, end }) => (
                  <NavLink key={to} to={to} end={end}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-zinc-800'}`}>
                    <Icon className="w-4 h-4" />{label}<ChevronRight className="w-3.5 h-3.5 ml-auto" />
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0"><Outlet /></main>
        </div>
      </div>
    </div>
  );
}

export function DashboardHome() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ wishlist: 0, bookings: 0, inquiries: 0 });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('wishlist').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('test_ride_bookings').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]).then(([w, b, i]) => { setStats({ wishlist: w.count || 0, bookings: b.count || 0, inquiries: i.count || 0 }); });
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Welcome back, {profile?.full_name?.split(' ')[0] || 'Rider'}!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Saved Bikes', value: stats.wishlist, to: '/dashboard/wishlist', color: 'text-red-400' },
          { label: 'Test Ride Bookings', value: stats.bookings, to: '/dashboard/bookings', color: 'text-blue-400' },
          { label: 'My Inquiries', value: stats.inquiries, to: '/dashboard/inquiries', color: 'text-emerald-400' },
        ].map(({ label, value, to, color }) => (
          <Link key={to} to={to} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 transition-all">
            <p className={`text-4xl font-black mb-1 ${color}`}>{value}</p><p className="text-gray-400 text-sm">{label}</p>
          </Link>
        ))}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/bikes" className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 rounded-xl text-blue-400 font-semibold text-sm transition-all">Browse Available Bikes →</Link>
          <Link to="/booking" className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-semibold text-sm transition-all">Book a Test Ride →</Link>
          <Link to="/contact" className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-semibold text-sm transition-all">Contact Our Team →</Link>
          <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-semibold text-sm transition-all">Update Profile →</Link>
        </div>
      </div>
    </div>
  );
}

export function DashboardWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<{ id: string; bike: { id: string; name: string; slug: string; cover_image_url: string; price: number } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('wishlist').select('id, bike:bikes(id, name, slug, cover_image_url, price)').eq('user_id', user.id).then(({ data }) => {
      setItems((data as typeof items) || []); setLoading(false);
    });
  }, [user]);

  async function remove(id: string) { await supabase.from('wishlist').delete().eq('id', id); setItems(items.filter(i => i.id !== id)); }

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Saved Bikes</h1>
      {loading ? <p className="text-gray-400">Loading...</p> : items.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800">
          <Heart className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-400">No saved bikes yet.</p>
          <Link to="/bikes" className="mt-4 inline-block text-blue-400 hover:text-blue-300 font-semibold text-sm">Browse Bikes →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex gap-4 p-4">
              <img src={item.bike?.cover_image_url || ''} alt="" className="w-24 h-20 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm line-clamp-2">{item.bike?.name}</h3>
                <p className="text-blue-400 font-bold text-sm mt-1">KES {item.bike?.price?.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <Link to={`/bikes/${item.bike?.slug}`} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">View →</Link>
                  <button onClick={() => remove(item.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<{ id: string; preferred_date: string; preferred_time: string; status: string; bike?: { name: string } | null; notes: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('test_ride_bookings').select('*, bike:bikes(name)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setBookings((data as typeof bookings) || []); setLoading(false);
    });
  }, [user]);

  const statusColors: Record<string, string> = { pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', cancelled: 'bg-red-500/20 text-red-400 border-red-500/30', completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30', rescheduled: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Test Ride Bookings</h1>
      {loading ? <p className="text-gray-400">Loading...</p> : bookings.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800">
          <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-400">No bookings yet.</p>
          <Link to="/booking" className="mt-4 inline-block text-blue-400 hover:text-blue-300 font-semibold text-sm">Book a Test Ride →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-bold">{b.bike?.name || 'Open Selection'}</p>
                  <p className="text-gray-400 text-sm mt-1">{b.preferred_date} at {b.preferred_time}</p>
                  {b.notes && <p className="text-gray-500 text-xs mt-2 line-clamp-1">{b.notes}</p>}
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize flex-shrink-0 ${statusColors[b.status] || 'bg-zinc-800 text-gray-400 border-zinc-700'}`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardInquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<{ id: string; message: string; status: string; bike?: { name: string } | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('inquiries').select('*, bike:bikes(name)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setInquiries((data as typeof inquiries) || []); setLoading(false);
    });
  }, [user]);

  const statusColors: Record<string, string> = { new: 'bg-blue-500/20 text-blue-400 border-blue-500/30', read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', replied: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', closed: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' };

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">My Inquiries</h1>
      {loading ? <p className="text-gray-400">Loading...</p> : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800">
          <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-3" /><p className="text-gray-400">No inquiries yet.</p>
          <Link to="/contact" className="mt-4 inline-block text-blue-400 hover:text-blue-300 font-semibold text-sm">Send an Inquiry →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-white font-bold text-sm">{inq.bike?.name || 'General Inquiry'}</p>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize flex-shrink-0 ${statusColors[inq.status] || ''}`}>{inq.status}</span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">{inq.message}</p>
              <p className="text-gray-600 text-xs mt-2">{new Date(inq.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: profile?.full_name || '', phone: profile?.phone || '', address: profile?.address || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '', address: profile.address || '' }); }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').upsert({ id: user.id, ...form });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-6">Profile Settings</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Address</label>
            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Email (cannot change)</label>
            <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-gray-500 text-sm rounded-xl cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
