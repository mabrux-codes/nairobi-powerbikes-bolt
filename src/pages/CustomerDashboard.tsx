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
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Customer Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111] border-b border-white/5 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center group-hover:from-red-500 group-hover:to-red-700 transition-all">
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-md w-7 h-7 flex items-center justify-center">
                  <Bike className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <span className="block text-white font-display font-black tracking-wider text-sm leading-tight">NAIROBI</span>
                <span className="block text-red-500 font-display font-bold text-[10px] tracking-[0.3em] leading-tight">POWERBIKES</span>
              </div>
            </Link>
            <span className="hidden sm:block text-gray-500 text-xs ml-2 pl-2 border-l border-white/10 font-display font-bold tracking-wider uppercase">My Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
            </Link>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 text-white font-display font-black text-xl">
                  {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-display font-bold tracking-tight">{profile?.full_name || 'Welcome!'}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {sideNav.map(({ to, label, icon: Icon, end }) => (
                  <NavLink key={to} to={to} end={end}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-bold tracking-wider uppercase transition-all ${isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
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
      <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Dashboard</p>
      <h1 className="text-2xl font-display font-black tracking-tight text-white mb-6">Welcome back, {profile?.full_name?.split(' ')[0] || 'Rider'}!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Saved Bikes', value: stats.wishlist, to: '/dashboard/wishlist', color: 'text-red-400' },
          { label: 'Test Ride Bookings', value: stats.bookings, to: '/dashboard/bookings', color: 'text-blue-400' },
          { label: 'My Inquiries', value: stats.inquiries, to: '/dashboard/inquiries', color: 'text-emerald-400' },
        ].map(({ label, value, to, color }) => (
          <Link key={to} to={to} className="card-premium p-6 transition-all">
            <p className={`text-4xl font-display font-black mb-1 ${color}`}>{value}</p>
            <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase">{label}</p>
          </Link>
        ))}
      </div>
      <div className="card-premium p-6">
        <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Quick Actions</p>
        <h2 className="text-lg font-display font-black tracking-tight text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/bikes" className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl text-red-400 font-display font-semibold text-sm transition-all">Browse Available Bikes &rarr;</Link>
          <Link to="/booking" className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white font-display font-semibold text-sm transition-all">Book a Test Ride &rarr;</Link>
          <Link to="/contact" className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white font-display font-semibold text-sm transition-all">Contact Our Team &rarr;</Link>
          <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white font-display font-semibold text-sm transition-all">Update Profile &rarr;</Link>
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
      <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Collection</p>
      <h1 className="text-2xl font-display font-black tracking-tight text-white mb-6">Saved Bikes</h1>
      {loading ? <p className="text-gray-400 font-display font-bold uppercase tracking-wider text-sm">Loading...</p> : items.length === 0 ? (
        <div className="card-premium text-center py-16">
          <Heart className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-display font-bold uppercase tracking-wider text-sm">No saved bikes yet.</p>
          <Link to="/bikes" className="mt-4 inline-block text-red-400 hover:text-red-300 font-display font-semibold text-sm">Browse Bikes &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="card-premium overflow-hidden flex gap-4 p-4">
              <img src={item.bike?.cover_image_url || ''} alt="" className="w-24 h-20 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-display font-bold text-sm line-clamp-2 tracking-tight">{item.bike?.name}</h3>
                <p className="text-red-400 font-display font-bold text-sm mt-1">KES {item.bike?.price?.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <Link to={`/bikes/${item.bike?.slug}`} className="text-xs text-red-400 hover:text-red-300 font-display font-semibold">View &rarr;</Link>
                  <button onClick={() => remove(item.id)} className="text-xs text-red-400 hover:text-red-300 font-display font-semibold">Remove</button>
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

  const statusColors: Record<string, string> = { pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', cancelled: 'bg-red-500/20 text-red-400 border-red-500/30', completed: 'bg-red-600/20 text-red-400 border-red-600/30', rescheduled: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };

  return (
    <div>
      <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Schedule</p>
      <h1 className="text-2xl font-display font-black tracking-tight text-white mb-6">Test Ride Bookings</h1>
      {loading ? <p className="text-gray-400 font-display font-bold uppercase tracking-wider text-sm">Loading...</p> : bookings.length === 0 ? (
        <div className="card-premium text-center py-16">
          <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-display font-bold uppercase tracking-wider text-sm">No bookings yet.</p>
          <Link to="/booking" className="mt-4 inline-block text-red-400 hover:text-red-300 font-display font-semibold text-sm">Book a Test Ride &rarr;</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="card-premium p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-display font-bold tracking-tight">{b.bike?.name || 'Open Selection'}</p>
                  <p className="text-gray-400 text-sm mt-1">{b.preferred_date} at {b.preferred_time}</p>
                  {b.notes && <p className="text-gray-500 text-xs mt-2 line-clamp-1">{b.notes}</p>}
                </div>
                <span className={`px-3 py-1 font-display font-bold text-[10px] uppercase tracking-wider rounded-full border capitalize flex-shrink-0 ${statusColors[b.status] || 'bg-white/5 text-gray-400 border-white/10'}`}>{b.status}</span>
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

  const statusColors: Record<string, string> = { new: 'bg-red-600/20 text-red-400 border-red-600/30', read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', replied: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', closed: 'bg-white/5 text-gray-500 border-white/10' };

  return (
    <div>
      <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Messages</p>
      <h1 className="text-2xl font-display font-black tracking-tight text-white mb-6">My Inquiries</h1>
      {loading ? <p className="text-gray-400 font-display font-bold uppercase tracking-wider text-sm">Loading...</p> : inquiries.length === 0 ? (
        <div className="card-premium text-center py-16">
          <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-display font-bold uppercase tracking-wider text-sm">No inquiries yet.</p>
          <Link to="/contact" className="mt-4 inline-block text-red-400 hover:text-red-300 font-display font-semibold text-sm">Send an Inquiry &rarr;</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div key={inq.id} className="card-premium p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-white font-display font-bold text-sm tracking-tight">{inq.bike?.name || 'General Inquiry'}</p>
                <span className={`px-3 py-1 font-display font-bold text-[10px] uppercase tracking-wider rounded-full border capitalize flex-shrink-0 ${statusColors[inq.status] || 'bg-white/5 text-gray-400 border-white/10'}`}>{inq.status}</span>
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
      <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Account</p>
      <h1 className="text-2xl font-display font-black tracking-tight text-white mb-6">Profile Settings</h1>
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Full Name</label>
            <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="input-premium" />
          </div>
          <div>
            <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="input-premium" />
          </div>
          <div>
            <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Address</label>
            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="input-premium" />
          </div>
          <div>
            <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Email (cannot change)</label>
            <input type="email" value={user?.email || ''} disabled className="input-premium opacity-50 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
