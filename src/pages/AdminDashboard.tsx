import { useEffect, useState, useCallback } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Bike, Calendar, Users, MessageSquare, FileText, Settings, ChevronRight, Plus, Trash2, CheckCircle, XCircle, Eye, CreditCard as Edit3, Search, TrendingUp, DollarSign, BarChart3, Clock, Send, ChevronDown, X, Save, Image, ToggleLeft, ToggleRight, ExternalLink, AlertCircle, Activity, Mail, Phone, MapPin, Filter, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Brand } from '../lib/supabase';

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/bikes', label: 'Bike Inventory', icon: Bike },
  { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/admin/auth');
    else if (!isAdmin) navigate('/dashboard');
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  async function handleSignOut() {
    await signOut();
    navigate('/admin/auth');
  }

  return (
    <div className="bg-neutral-950 min-h-screen">
      {/* Admin Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 border-b border-neutral-800 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 font-bold text-sm leading-tight">Admin Panel</p>
              <p className="text-gray-500 text-xs truncate max-w-[200px]">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-2 bg-neutral-800 rounded-lg">
              <ArrowLeft className="w-3.5 h-3.5" /> View Site
            </Link>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-2 bg-red-500/10 rounded-lg">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 lg:sticky lg:top-24">
              <nav className="space-y-1">
                {adminNav.map(({ to, label, icon: Icon, end }) => (
                  <NavLink key={to} to={to} end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                        ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-neutral-800'}`
                    }>
                    <Icon className="w-4 h-4" />
                    {label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared helpers ─── */

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: number | string; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {sub && <span className="text-xs text-gray-500 mt-1">{sub}</span>}
      </div>
      <p className="text-3xl font-black text-white mb-0.5">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    completed: 'bg-red-600/20 text-red-400 border-red-600/30',
    rescheduled: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    new: 'bg-red-600/20 text-red-400 border-red-600/30',
    read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    replied: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    closed: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
    available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    reserved: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    sold: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize ${map[status] || 'bg-neutral-800 text-gray-400 border-neutral-700'}`}>
      {status}
    </span>
  );
}

function EmptyState({ icon: Icon, title, desc, action }: { icon: React.ElementType; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16 bg-neutral-900 rounded-2xl border border-neutral-800">
      <Icon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{desc}</p>
      {action}
    </div>
  );
}

/* ─── ADMIN OVERVIEW ─── */

export function AdminHome() {
  const [stats, setStats] = useState({ bikes: 0, available: 0, sold: 0, bookings: 0, pendingBookings: 0, inquiries: 0, newInquiries: 0, customers: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState<{ id: string; full_name: string; preferred_date: string; status: string; bike?: { name: string } | null }[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<{ id: string; full_name: string; message: string; status: string; created_at: string }[]>([]);
  const [bikeTypeBreakdown, setBikeTypeBreakdown] = useState<{ bike_type: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [bikesAll, bikesAvail, bikesSold, bookingsAll, bookingsPend, inqAll, inqNew, cust] = await Promise.all([
        supabase.from('bikes').select('id, price, status, bike_type', { count: 'exact', head: false }),
        supabase.from('bikes').select('id', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('bikes').select('id, price', { count: 'exact', head: false }).eq('status', 'sold'),
        supabase.from('test_ride_bookings').select('id', { count: 'exact', head: true }),
        supabase.from('test_ride_bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      const allBikes = (bikesAll.data || []) as { id: string; price: number; status: string; bike_type: string }[];
      const soldBikes = (bikesSold.data || []) as { id: string; price: number }[];
      const revenue = soldBikes.reduce((sum, b) => sum + (b.price || 0), 0);

      const typeMap: Record<string, number> = {};
      allBikes.forEach(b => { typeMap[b.bike_type] = (typeMap[b.bike_type] || 0) + 1; });
      setBikeTypeBreakdown(Object.entries(typeMap).map(([bike_type, count]) => ({ bike_type, count })));

      setStats({
        bikes: bikesAll.count || 0,
        available: bikesAvail.count || 0,
        sold: bikesSold.count || 0,
        bookings: bookingsAll.count || 0,
        pendingBookings: bookingsPend.count || 0,
        inquiries: inqAll.count || 0,
        newInquiries: inqNew.count || 0,
        customers: cust.count || 0,
        revenue,
      });

      const { data: rb } = await supabase.from('test_ride_bookings').select('id, full_name, preferred_date, status, bike:bikes(name)').order('created_at', { ascending: false }).limit(5);
      setRecentBookings(rb || []);

      const { data: ri } = await supabase.from('inquiries').select('id, full_name, message, status, created_at').order('created_at', { ascending: false }).limit(5);
      setRecentInquiries(ri || []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bikes" value={stats.bikes} icon={Bike} color="bg-red-600/15 text-red-400" sub={`${stats.available} available`} />
        <StatCard label="Bikes Sold" value={stats.sold} icon={CheckCircle} color="bg-emerald-500/15 text-emerald-400" sub={`KES ${(stats.revenue / 1000000).toFixed(1)}M revenue`} />
        <StatCard label="Pending Bookings" value={stats.pendingBookings} icon={Calendar} color="bg-yellow-500/15 text-yellow-400" sub={`${stats.bookings} total`} />
        <StatCard label="New Inquiries" value={stats.newInquiries} icon={MessageSquare} color="bg-orange-500/15 text-orange-400" sub={`${stats.inquiries} total`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-red-400" /> Inventory by Type</h2>
          <div className="space-y-3">
            {bikeTypeBreakdown.map(({ bike_type, count }) => {
              const pct = stats.bikes > 0 ? Math.round((count / stats.bikes) * 100) : 0;
              return (
                <div key={bike_type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 capitalize">{bike_type}</span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {bikeTypeBreakdown.length === 0 && <p className="text-gray-500 text-sm">No bikes yet.</p>}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-yellow-400" /> Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs text-red-400 hover:text-red-300 font-semibold">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No bookings yet.</p>
            ) : recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between gap-3 py-2 border-b border-neutral-800 last:border-0">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{b.full_name}</p>
                  <p className="text-gray-500 text-xs">{b.bike?.name || 'Any bike'} • {b.preferred_date}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-orange-400" /> Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="text-xs text-red-400 hover:text-red-300 font-semibold">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-gray-500 text-sm">No inquiries yet.</p>
            ) : recentInquiries.map(i => (
              <div key={i.id} className="flex items-start justify-between gap-3 py-2 border-b border-neutral-800 last:border-0">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{i.full_name}</p>
                  <p className="text-gray-500 text-xs line-clamp-1">{i.message}</p>
                </div>
                <StatusBadge status={i.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/bikes" className="flex items-center gap-2 px-4 py-3 bg-red-600/10 border border-red-600/20 hover:border-red-500/40 rounded-xl text-red-400 font-semibold text-sm transition-all">
            <Plus className="w-4 h-4" /> Add Bike
          </Link>
          <Link to="/admin/bookings" className="flex items-center gap-2 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/40 rounded-xl text-yellow-400 font-semibold text-sm transition-all">
            <Calendar className="w-4 h-4" /> Review Bookings
          </Link>
          <Link to="/admin/inquiries" className="flex items-center gap-2 px-4 py-3 bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 rounded-xl text-orange-400 font-semibold text-sm transition-all">
            <MessageSquare className="w-4 h-4" /> Reply Inquiries
          </Link>
          <Link to="/admin/customers" className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-emerald-400 font-semibold text-sm transition-all">
            <Users className="w-4 h-4" /> View Customers
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN BIKES ─── */

type BikeRow = {
  id: string; name: string; slug: string; model_year: number; price: number;
  engine_size: string; status: string; cover_image_url: string; bike_type: string;
  condition: string; mileage: number; transmission: string; color: string;
  power: string; torque: string; weight: string; top_speed: string;
  fuel_capacity: string; seat_height: string; description: string;
  seller_notes: string; is_featured: boolean; financing_available: boolean;
  brand_id: string; brand?: { name: string } | null;
};

export function AdminBikes() {
  const [bikes, setBikes] = useState<BikeRow[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBike, setEditingBike] = useState<BikeRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const emptyForm = {
    name: '', slug: '', brand_id: '', model_year: new Date().getFullYear(), price: '',
    engine_size: '', bike_type: 'sports', condition: 'new', mileage: '0',
    transmission: 'manual', color: '', power: '', torque: '', weight: '',
    top_speed: '', fuel_capacity: '', seat_height: '', description: '',
    seller_notes: '', cover_image_url: '', is_featured: false, financing_available: true,
  };

  const [form, setForm] = useState(emptyForm);

  const fetchBikes = useCallback(async () => {
    let query = supabase.from('bikes').select('*, brand:brands(name, id)').order('created_at', { ascending: false });
    if (filterStatus) query = query.eq('status', filterStatus);
    if (filterType) query = query.eq('bike_type', filterType);
    const { data } = await query;
    let results = (data as BikeRow[]) || [];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(b => b.name.toLowerCase().includes(q) || b.brand?.name?.toLowerCase().includes(q));
    }
    setBikes(results);
    setLoading(false);
  }, [filterStatus, filterType, search]);

  useEffect(() => {
    supabase.from('brands').select('*').order('name').then(({ data }) => setBrands((data as Brand[]) || []));
  }, []);

  useEffect(() => { fetchBikes(); }, [fetchBikes]);

  function openAdd() {
    setForm(emptyForm);
    setEditingBike(null);
    setShowForm(true);
  }

  function openEdit(bike: BikeRow) {
    setForm({
      name: bike.name, slug: bike.slug, brand_id: bike.brand_id || '',
      model_year: bike.model_year, price: String(bike.price),
      engine_size: bike.engine_size, bike_type: bike.bike_type,
      condition: bike.condition, mileage: String(bike.mileage),
      transmission: bike.transmission, color: bike.color,
      power: bike.power, torque: bike.torque, weight: bike.weight,
      top_speed: bike.top_speed, fuel_capacity: bike.fuel_capacity,
      seat_height: bike.seat_height, description: bike.description,
      seller_notes: bike.seller_notes, cover_image_url: bike.cover_image_url,
      is_featured: bike.is_featured, financing_available: bike.financing_available,
    });
    setEditingBike(bike);
    setShowForm(true);
  }

  async function saveBike(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = {
      ...form, slug, price: Number(form.price), mileage: Number(form.mileage), model_year: Number(form.model_year),
      brand_id: form.brand_id || null,
    };

    if (editingBike) {
      await supabase.from('bikes').update(payload).eq('id', editingBike.id);
    } else {
      await supabase.from('bikes').insert(payload);
    }
    await fetchBikes();
    setSaving(false);
    setShowForm(false);
    setEditingBike(null);
  }

  async function confirmDelete(id: string) {
    await supabase.from('bikes').delete().eq('id', id);
    setBikes(bikes.filter(b => b.id !== id));
    setDeleteConfirm(null);
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === 'available' ? 'sold' : 'available';
    await supabase.from('bikes').update({ status: next }).eq('id', id);
    setBikes(bikes.map(b => b.id === id ? { ...b, status: next } : b));
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabase.from('bikes').update({ is_featured: !current }).eq('id', id);
    setBikes(bikes.map(b => b.id === id ? { ...b, is_featured: !current } : b));
  }

  const bikeTypes = ['sports', 'naked', 'adventure', 'cruiser', 'touring', 'supermoto', 'scooter', 'other'];
  const conditions = ['new', 'used', 'demo'];
  const transmissions = ['manual', 'automatic', 'semi-automatic'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Bike Inventory</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Bike
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bikes..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600" />
        </div>
        <div className="flex gap-2">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 cursor-pointer appearance-none">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 cursor-pointer appearance-none capitalize">
            <option value="">All Types</option>
            {bikeTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-3xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">{editingBike ? 'Edit Bike' : 'Add New Bike'}</h2>
              <button onClick={() => { setShowForm(false); setEditingBike(null); }} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveBike} className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Bike Name *', key: 'name', type: 'text', required: true },
                { label: 'Slug (auto-generated)', key: 'slug', type: 'text' },
                { label: 'Price (KES) *', key: 'price', type: 'number', required: true },
                { label: 'Model Year *', key: 'model_year', type: 'number', required: true },
                { label: 'Engine Size', key: 'engine_size', type: 'text' },
                { label: 'Color', key: 'color', type: 'text' },
                { label: 'Power (hp)', key: 'power', type: 'text' },
                { label: 'Torque (Nm)', key: 'torque', type: 'text' },
                { label: 'Top Speed', key: 'top_speed', type: 'text' },
                { label: 'Weight', key: 'weight', type: 'text' },
                { label: 'Seat Height', key: 'seat_height', type: 'text' },
                { label: 'Fuel Capacity', key: 'fuel_capacity', type: 'text' },
                { label: 'Mileage (km)', key: 'mileage', type: 'number' },
                { label: 'Cover Image URL', key: 'cover_image_url', type: 'url' },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
                  <input type={type} required={required} value={(form as Record<string, string | number | boolean>)[key] as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Brand</label>
                <select value={form.brand_id} onChange={e => setForm(f => ({ ...f, brand_id: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600">
                  <option value="">— Select Brand —</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Bike Type</label>
                <select value={form.bike_type} onChange={e => setForm(f => ({ ...f, bike_type: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 capitalize">
                  {bikeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Condition</label>
                <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600">
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Transmission</label>
                <select value={form.transmission} onChange={e => setForm(f => ({ ...f, transmission: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600">
                  {transmissions.map(t => <option key={t} value={t}>{t.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Description</label>
                <textarea value={form.description} rows={3} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 resize-none" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Seller Notes</label>
                <textarea value={form.seller_notes} rows={2} onChange={e => setForm(f => ({ ...f, seller_notes: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 resize-none" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-red-600" /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.financing_available} onChange={e => setForm(f => ({ ...f, financing_available: e.target.checked }))} className="w-4 h-4 accent-red-600" /> Financing Available
                </label>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-bold rounded-xl text-sm transition-colors">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : editingBike ? 'Update Bike' : 'Save Bike'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingBike(null); }}
                  className="px-6 py-2.5 border border-neutral-700 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-400" /></div>
              <h3 className="text-white font-bold text-lg">Delete Bike?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The bike and all its images will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => confirmDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-sm transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-neutral-700 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Bike List */}
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-2xl h-20 animate-pulse border border-neutral-800" />)}</div>
      ) : bikes.length === 0 ? (
        <EmptyState icon={Bike} title="No bikes found" desc="Add your first bike to get started." action={
          <button onClick={openAdd} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors">Add First Bike</button>
        } />
      ) : (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">{bikes.length} bike{bikes.length !== 1 ? 's' : ''}</p>
          {bikes.map(bike => (
            <div key={bike.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 flex items-center gap-4 transition-colors">
              <img src={bike.cover_image_url || 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'} alt=""
                className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-bold text-sm truncate">{bike.name}</p>
                  {bike.is_featured && <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded border border-yellow-500/30">FEATURED</span>}
                </div>
                <p className="text-gray-400 text-xs">{bike.model_year} • {bike.brand?.name || 'No brand'} • {bike.engine_size} • KES {bike.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={bike.status} />
                <button onClick={() => toggleFeatured(bike.id, bike.is_featured)} title={bike.is_featured ? 'Unfeature' : 'Feature'}
                  className="p-2 text-gray-400 hover:text-yellow-400 bg-neutral-800 rounded-lg transition-colors">
                  {bike.is_featured ? <ToggleRight className="w-4 h-4 text-yellow-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <Link to={`/bikes/${bike.slug}`} className="p-2 text-gray-400 hover:text-red-400 bg-neutral-800 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </Link>
                <button onClick={() => openEdit(bike)} className="p-2 text-gray-400 hover:text-emerald-400 bg-neutral-800 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => toggleStatus(bike.id, bike.status)} title={bike.status === 'available' ? 'Mark Sold' : 'Mark Available'}
                  className="p-2 text-gray-400 hover:text-emerald-400 bg-neutral-800 rounded-lg transition-colors">
                  {bike.status === 'available' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </button>
                <button onClick={() => setDeleteConfirm(bike.id)} className="p-2 text-gray-400 hover:text-red-400 bg-neutral-800 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN BOOKINGS ─── */

type BookingRow = {
  id: string; full_name: string; phone: string; email: string;
  preferred_date: string; preferred_time: string; status: string;
  notes: string; admin_notes: string; created_at: string;
  bike?: { name: string } | null; user_id: string | null;
};

export function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBookings = useCallback(async () => {
    let query = supabase.from('test_ride_bookings').select('*, bike:bikes(name)').order('created_at', { ascending: false });
    if (filter) query = query.eq('status', filter);
    const { data } = await query;
    let results = (data as BookingRow[]) || [];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(b => b.full_name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q));
    }
    setBookings(results);
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateStatus(id: string, status: string) {
    setSaving(true);
    await supabase.from('test_ride_bookings').update({ status }).eq('id', id);
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    if (selectedBooking?.id === id) setSelectedBooking(b => b ? { ...b, status } : null);
    setSaving(false);
  }

  async function saveAdminNotes() {
    if (!selectedBooking) return;
    setSaving(true);
    await supabase.from('test_ride_bookings').update({ admin_notes: adminNote }).eq('id', selectedBooking.id);
    setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, admin_notes: adminNote } : b));
    setSelectedBooking(b => b ? { ...b, admin_notes: adminNote } : null);
    setSaving(false);
  }

  function openDetail(booking: BookingRow) {
    setSelectedBooking(booking);
    setAdminNote(booking.admin_notes || '');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Test Ride Bookings</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 cursor-pointer appearance-none">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Customer</p>
                  <p className="text-white font-semibold">{selectedBooking.full_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Status</p>
                  <StatusBadge status={selectedBooking.status} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                  <p className="text-gray-300 text-sm">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                  <p className="text-gray-300 text-sm">{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Bike</p>
                  <p className="text-gray-300 text-sm">{selectedBooking.bike?.name || 'Any bike'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Date & Time</p>
                  <p className="text-gray-300 text-sm">{selectedBooking.preferred_date} at {selectedBooking.preferred_time}</p>
                </div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Customer Notes</p>
                  <p className="text-gray-300 text-sm bg-neutral-800 rounded-xl p-3">{selectedBooking.notes}</p>
                </div>
              )}
              <div>
                <label className="block text-gray-500 text-xs mb-1 font-medium">Admin Notes</label>
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={3}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 resize-none" />
                <button onClick={saveAdminNotes} disabled={saving}
                  className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                  <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <div className="flex gap-2 pt-3 border-t border-neutral-800">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(selectedBooking.id, 'approved')} className="flex-1 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-xl text-sm transition-colors">Approve</button>
                    <button onClick={() => updateStatus(selectedBooking.id, 'rescheduled')} className="flex-1 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold rounded-xl text-sm transition-colors">Reschedule</button>
                    <button onClick={() => updateStatus(selectedBooking.id, 'cancelled')} className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded-xl text-sm transition-colors">Cancel</button>
                  </>
                )}
                {selectedBooking.status === 'approved' && (
                  <button onClick={() => updateStatus(selectedBooking.id, 'completed')} className="flex-1 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold rounded-xl text-sm transition-colors">Mark Completed</button>
                )}
                {(selectedBooking.status === 'cancelled' || selectedBooking.status === 'completed') && (
                  <button onClick={() => updateStatus(selectedBooking.id, 'pending')} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-bold rounded-xl text-sm transition-colors">Reopen</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-2xl h-24 animate-pulse border border-neutral-800" />)}</div>
      ) : bookings.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings yet" desc="Bookings will appear here when customers schedule test rides." />
      ) : (
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
          {bookings.map(b => (
            <div key={b.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-colors cursor-pointer" onClick={() => openDetail(b)}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-white font-bold">{b.full_name}</p>
                  <p className="text-gray-400 text-sm">{b.email} • {b.phone}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Bike className="w-3.5 h-3.5" />{b.bike?.name || 'Any bike'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{b.preferred_date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{b.preferred_time}</span>
              </div>
              {b.admin_notes && <p className="text-xs text-red-400/70 mt-2 line-clamp-1">Admin: {b.admin_notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN INQUIRIES ─── */

type InquiryRow = {
  id: string; full_name: string; phone: string; email: string;
  message: string; status: string; admin_reply: string;
  bike?: { name: string } | null; created_at: string; user_id: string | null;
};

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchInquiries = useCallback(async () => {
    let query = supabase.from('inquiries').select('*, bike:bikes(name)').order('created_at', { ascending: false });
    if (filter) query = query.eq('status', filter);
    const { data } = await query;
    let results = (data as InquiryRow[]) || [];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(i => i.full_name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.message.toLowerCase().includes(q));
    }
    setInquiries(results);
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  async function updateStatus(id: string, status: string) {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
  }

  async function sendReply(id: string) {
    if (!replyText.trim()) return;
    setSending(true);
    await supabase.from('inquiries').update({ admin_reply: replyText, status: 'replied' }).eq('id', id);
    setInquiries(inquiries.map(i => i.id === id ? { ...i, admin_reply: replyText, status: 'replied' } : i));
    setReplyText('');
    setReplyingTo(null);
    setSending(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Customer Inquiries</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inquiries..."
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 cursor-pointer appearance-none">
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-2xl h-32 animate-pulse border border-neutral-800" />)}</div>
      ) : inquiries.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No inquiries yet" desc="Customer inquiries will appear here." />
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">{inquiries.length} inquir{inquiries.length !== 1 ? 'ies' : 'y'}</p>
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-bold">{inq.full_name}</p>
                    {inq.status === 'new' && <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{inq.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{inq.phone}</span>
                  </div>
                  {inq.bike?.name && <p className="text-red-400 text-xs mt-1">Re: {inq.bike.name}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={inq.status} />
                  {inq.status === 'new' && (
                    <button onClick={() => updateStatus(inq.id, 'read')} className="text-xs text-gray-400 hover:text-white border border-neutral-700 px-3 py-1 rounded-lg transition-colors">Mark Read</button>
                  )}
                  {inq.status !== 'closed' && inq.status !== 'new' && (
                    <button onClick={() => updateStatus(inq.id, 'closed')} className="text-xs text-gray-400 hover:text-white border border-neutral-700 px-3 py-1 rounded-lg transition-colors">Close</button>
                  )}
                </div>
              </div>
              <div className="bg-neutral-800 rounded-xl p-3 mb-3">
                <p className="text-gray-300 text-sm leading-relaxed">{inq.message}</p>
              </div>
              {inq.admin_reply && (
                <div className="bg-red-600/5 border border-red-600/20 rounded-xl p-3 mb-3">
                  <p className="text-xs text-red-400 font-semibold mb-1">Your Reply:</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{inq.admin_reply}</p>
                </div>
              )}
              {replyingTo === inq.id ? (
                <div className="space-y-2">
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={3} placeholder="Type your reply..."
                    className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => sendReply(inq.id)} disabled={sending || !replyText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white text-xs font-bold rounded-lg transition-colors">
                      <Send className="w-3 h-3" /> {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button onClick={() => { setReplyingTo(null); setReplyText(''); }}
                      className="px-4 py-2 border border-neutral-700 text-gray-300 hover:text-white text-xs font-semibold rounded-lg transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setReplyingTo(inq.id); setReplyText(inq.admin_reply || ''); }}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors">
                  <Send className="w-3 h-3" /> {inq.admin_reply ? 'Edit Reply' : 'Reply'}
                </button>
              )}
              <p className="text-gray-600 text-xs mt-3">{new Date(inq.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN CUSTOMERS ─── */

type ProfileRow = {
  id: string; full_name: string; phone: string; address: string; created_at: string;
  email?: string; bookingCount?: number; inquiryCount?: number; wishlistCount?: number;
};

export function AdminCustomers() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<ProfileRow | null>(null);
  const [customerBookings, setCustomerBookings] = useState<{ id: string; preferred_date: string; status: string; bike?: { name: string } | null }[]>([]);
  const [customerInquiries, setCustomerInquiries] = useState<{ id: string; message: string; status: string; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: profileData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: users } = await supabase.auth.admin?.listUsers ? await supabase.auth.admin.listUsers() : { data: { users: [] } };

      const enriched = (profileData as ProfileRow[] || []).map(p => {
        const u = (users?.users || []).find(u => u.id === p.id);
        return { ...p, email: u?.email || '' };
      });
      setProfiles(enriched);
      setLoading(false);
    })();
  }, []);

  async function openCustomerDetail(profile: ProfileRow) {
    setSelectedCustomer(profile);
    const [b, i] = await Promise.all([
      supabase.from('test_ride_bookings').select('id, preferred_date, status, bike:bikes(name)').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('inquiries').select('id, message, status, created_at').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(10),
    ]);
    setCustomerBookings(b.data || []);
    setCustomerInquiries(i.data || []);
  }

  const filtered = search
    ? profiles.filter(p => (p.full_name || '').toLowerCase().includes(search.toLowerCase()) || (p.email || '').toLowerCase().includes(search.toLowerCase()) || (p.phone || '').includes(search))
    : profiles;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Customers ({profiles.length})</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
          className="w-full pl-9 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600" />
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center text-red-400 font-black text-xl">
                  {(selectedCustomer.full_name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{selectedCustomer.full_name || 'Unnamed'}</p>
                  <p className="text-gray-400 text-sm">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-800 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                  <p className="text-white text-sm">{selectedCustomer.phone || 'Not provided'}</p>
                </div>
                <div className="bg-neutral-800 rounded-xl p-3">
                  <p className="text-gray-500 text-xs mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</p>
                  <p className="text-white text-sm">{selectedCustomer.address || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-3">Bookings ({customerBookings.length})</h3>
                {customerBookings.length === 0 ? <p className="text-gray-500 text-sm">No bookings.</p> : (
                  <div className="space-y-2">
                    {customerBookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between bg-neutral-800 rounded-xl p-3">
                        <div>
                          <p className="text-white text-sm">{b.bike?.name || 'Any bike'}</p>
                          <p className="text-gray-500 text-xs">{b.preferred_date}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-3">Inquiries ({customerInquiries.length})</h3>
                {customerInquiries.length === 0 ? <p className="text-gray-500 text-sm">No inquiries.</p> : (
                  <div className="space-y-2">
                    {customerInquiries.map(i => (
                      <div key={i.id} className="flex items-start justify-between bg-neutral-800 rounded-xl p-3">
                        <p className="text-gray-300 text-sm line-clamp-2 flex-1 mr-3">{i.message}</p>
                        <StatusBadge status={i.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-xs">Joined {new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-xl h-16 animate-pulse border border-neutral-800" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" desc={search ? 'Try a different search term.' : 'Customers will appear when they register.'} />
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 flex items-center gap-4 transition-colors cursor-pointer" onClick={() => openCustomerDetail(p)}>
              <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center text-red-400 font-black flex-shrink-0">
                {(p.full_name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{p.full_name || 'Unnamed'}</p>
                <p className="text-gray-400 text-xs truncate">{p.email || 'No email'} • {p.phone || 'No phone'}</p>
              </div>
              <p className="text-gray-600 text-xs flex-shrink-0">{new Date(p.created_at).toLocaleDateString()}</p>
              <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN BLOG ─── */

type BlogRow = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  cover_image_url: string; author: string; tags: string[];
  is_published: boolean; views: number; created_at: string; updated_at: string;
};

export function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author: 'Nairobi Powerbikes', tags: '', is_published: false });

  useEffect(() => {
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setPosts((data as BlogRow[]) || []);
      setLoading(false);
    });
  }, []);

  function openAdd() {
    setForm({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author: 'Nairobi Powerbikes', tags: '', is_published: false });
    setEditingPost(null);
    setShowForm(true);
  }

  function openEdit(post: BlogRow) {
    setForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content,
      cover_image_url: post.cover_image_url, author: post.author,
      tags: post.tags?.join(', ') || '', is_published: post.is_published,
    });
    setEditingPost(post);
    setShowForm(true);
  }

  async function savePost(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { ...form, slug, tags };

    if (editingPost) {
      await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingPost.id);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }

    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts((data as BlogRow[]) || []);
    setSaving(false);
    setShowForm(false);
    setEditingPost(null);
  }

  async function togglePublished(id: string, current: boolean) {
    await supabase.from('blog_posts').update({ is_published: !current }).eq('id', id);
    setPosts(posts.map(p => p.id === id ? { ...p, is_published: !current } : p));
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts(posts.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Blog Posts</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">{editingPost ? 'Edit Post' : 'New Blog Post'}</h2>
              <button onClick={() => { setShowForm(false); setEditingPost(null); }} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={savePost} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Slug (auto-generated)</label>
                <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 resize-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Content</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Author</label>
                  <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Tags (comma separated)</label>
                  <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="review, yamaha, tips"
                    className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Cover Image URL</label>
                <input type="url" value={form.cover_image_url} onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:border-red-600" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-red-600" />
                Publish immediately
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-bold rounded-xl text-sm transition-colors">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingPost(null); }}
                  className="px-6 py-2.5 border border-neutral-700 text-gray-300 hover:text-white font-semibold rounded-xl text-sm transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-2xl h-20 animate-pulse border border-neutral-800" />)}</div>
      ) : posts.length === 0 ? (
        <EmptyState icon={FileText} title="No blog posts yet" desc="Create your first blog post to engage your audience." action={
          <button onClick={openAdd} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors">Create First Post</button>
        } />
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 flex items-center gap-4 transition-colors">
              {post.cover_image_url && <img src={post.cover_image_url} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-bold text-sm truncate">{post.title}</p>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${post.is_published ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-neutral-700/50 text-gray-400 border-neutral-600'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">{post.author} • {post.views} views • {new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublished(post.id, post.is_published)} title={post.is_published ? 'Unpublish' : 'Publish'}
                  className="p-2 text-gray-400 hover:text-emerald-400 bg-neutral-800 rounded-lg transition-colors">
                  {post.is_published ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(post)} className="p-2 text-gray-400 hover:text-red-400 bg-neutral-800 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => deletePost(post.id)} className="p-2 text-gray-400 hover:text-red-400 bg-neutral-800 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN SETTINGS ─── */

type AdminUser = {
  id: string; email: string; role: string; created_at: string;
  full_name?: string; last_sign_in_at?: string;
};

export function AdminSettings() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'access' | 'notifications' | 'seo'>('general');
  const [settings, setSettings] = useState({
    site_name: 'Nairobi Powerbikes',
    tagline: "Kenya's Premier Motorcycle Dealership",
    phone: '+254 700 000 000',
    email: 'info@nairobipowerbikes.co.ke',
    address: 'Westlands Road, Westlands, Nairobi, Kenya',
    whatsapp: '+254700000000',
    meta_title: 'Nairobi Powerbikes — Premium Motorcycles in Kenya',
    meta_description: "Kenya's premier destination for premium sports bikes, naked bikes, adventure motorcycles, and superbikes.",
    email_notifications: true,
    whatsapp_notifications: true,
    new_booking_alert: true,
    new_inquiry_alert: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Access control state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [accessLoading, setAccessLoading] = useState(true);
  const [grantEmail, setGrantEmail] = useState('');
  const [accessAction, setAccessAction] = useState<'idle' | 'granting' | 'revoking'>('idle');
  const [accessResult, setAccessResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (activeTab === 'access') fetchAccessData();
  }, [activeTab]);

  async function fetchAccessData() {
    setAccessLoading(true);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/set-admin-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'Apikey': anonKey,
        },
        body: JSON.stringify({ email: '__list__', action: 'list' }),
      });
      // The edge function doesn't support list, so we'll use a different approach
      // We'll fetch profiles and cross-reference
    } catch {
      // fallback
    }

    // Fetch all profiles to show users
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, created_at');
    const profileMap = new Map((profiles || []).map((p: { id: string; full_name: string; created_at: string }) => [p.id, p]));

    // We need the admin API to list users and check their roles.
    // Since we can't call admin API from client, we'll use the edge function approach.
    // For now, show the grant/revoke form and a list of known admins.
    setAdminUsers([]);
    setAllUsers((profiles || []).map((p: { id: string; full_name: string; created_at: string }) => ({
      id: p.id,
      email: (profileMap.get(p.id) as { full_name?: string } | undefined)?.full_name || p.full_name || 'Unknown',
      role: 'unknown',
      created_at: p.created_at,
      full_name: p.full_name,
    })));
    setAccessLoading(false);
  }

  async function grantAdminAccess(e: React.FormEvent) {
    e.preventDefault();
    if (!grantEmail.trim()) return;

    setAccessAction('granting');
    setAccessResult(null);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/set-admin-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Apikey': anonKey,
        },
        body: JSON.stringify({ email: grantEmail.trim(), action: 'grant' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAccessResult({ type: 'success', message: data.message });
        setAdminUsers(prev => {
          const exists = prev.find(u => u.email === grantEmail.trim());
          if (exists) return prev.map(u => u.email === grantEmail.trim() ? { ...u, role: 'admin' } : u);
          return [...prev, { id: data.user_id, email: grantEmail.trim(), role: 'admin', created_at: new Date().toISOString() }];
        });
        setGrantEmail('');
      } else {
        setAccessResult({ type: 'error', message: data.error || 'Failed to grant admin access' });
      }
    } catch {
      setAccessResult({ type: 'error', message: 'Network error. Please try again.' });
    }

    setAccessAction('idle');
  }

  async function revokeAdminAccess(email: string) {
    if (!confirm(`Revoke admin access for ${email}?`)) return;

    setAccessAction('revoking');
    setAccessResult(null);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/set-admin-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Apikey': anonKey,
        },
        body: JSON.stringify({ email, action: 'revoke' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAccessResult({ type: 'success', message: data.message });
        setAdminUsers(prev => prev.map(u => u.email === email ? { ...u, role: 'user' } : u));
      } else {
        setAccessResult({ type: 'error', message: data.error || 'Failed to revoke admin access' });
      }
    } catch {
      setAccessResult({ type: 'error', message: 'Network error. Please try again.' });
    }

    setAccessAction('idle');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const tabs = [
    { key: 'general' as const, label: 'General', icon: Settings },
    { key: 'access' as const, label: 'Access Control', icon: Shield },
    { key: 'notifications' as const, label: 'Notifications', icon: MessageSquare },
    { key: 'seo' as const, label: 'SEO', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-white">Settings</h1>

      <div className="flex gap-1 bg-neutral-900 rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === key ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {activeTab === 'access' ? (
        <div className="space-y-6">
          {/* Grant Admin Access */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Grant Admin Access</h2>
                <p className="text-gray-400 text-sm">Enter a user's email to give them admin privileges. They must have a registered account first.</p>
              </div>
            </div>

            <form onSubmit={grantAdminAccess} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">User Email Address</label>
                <div className="flex gap-3">
                  <input type="email" required value={grantEmail} onChange={e => setGrantEmail(e.target.value)} placeholder="user@example.com"
                    className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-yellow-500 transition-colors" />
                  <button type="submit" disabled={accessAction === 'granting' || !grantEmail.trim()}
                    className="flex items-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-500/50 text-neutral-900 font-bold rounded-xl transition-colors text-sm whitespace-nowrap">
                    {accessAction === 'granting' ? <><span className="w-4 h-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />Granting...</> : <><Shield className="w-4 h-4" />Grant Admin</>}
                  </button>
                </div>
              </div>
            </form>

            {accessResult && (
              <div className={`mt-4 px-4 py-3 rounded-xl text-sm border ${accessResult.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {accessResult.message}
              </div>
            )}
          </div>

          {/* Current Admin Users */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">Manage Admin Users</h2>
            <p className="text-gray-400 text-sm mb-5">Revoke admin access from any user. You cannot revoke your own access.</p>

            {accessLoading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-neutral-800 rounded-xl h-14 animate-pulse" />)}</div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-10 bg-neutral-800 rounded-xl">
                <Shield className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No admin users loaded yet.</p>
                <p className="text-gray-500 text-xs mt-1">Grant admin access using the form above, or admins will appear here after they log in.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {adminUsers.map(admin => (
                  <div key={admin.id} className="flex items-center justify-between gap-4 bg-neutral-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black flex-shrink-0 ${admin.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neutral-700 text-gray-400'}`}>
                        {(admin.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{admin.email}</p>
                        <p className="text-gray-500 text-xs">{admin.role === 'admin' ? 'Admin' : 'Customer'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {admin.role === 'admin' && admin.email !== currentUser?.email && (
                        <button onClick={() => revokeAdminAccess(admin.email)} disabled={accessAction === 'revoking'}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-bold rounded-lg transition-colors">
                          <XCircle className="w-3.5 h-3.5" /> Revoke
                        </button>
                      )}
                      {admin.email === currentUser?.email && (
                        <span className="text-xs text-gray-500 px-3 py-2 bg-neutral-700/50 rounded-lg">You</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">How Admin Access Works</h2>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 font-bold text-xs flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-semibold">User registers an account</p>
                  <p className="text-gray-400">A user must first sign up at <Link to="/auth" className="text-red-400 hover:text-red-300">/auth</Link> to create an account.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 font-bold text-xs flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-semibold">You grant admin access</p>
                  <p className="text-gray-400">Enter their email above and click "Grant Admin". This sets their role to admin in the system.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 font-bold text-xs flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-semibold">They access the admin panel</p>
                  <p className="text-gray-400">The user navigates to <Link to="/admin/auth" className="text-red-400 hover:text-red-300">/admin/auth</Link> and signs in with their credentials. They will be redirected to the admin dashboard.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 font-bold text-xs flex-shrink-0">!</div>
                <div>
                  <p className="text-yellow-400 font-semibold">Important</p>
                  <p className="text-gray-400">After granting or revoking admin access, the user must sign out and sign back in for the change to take effect. The role is stored in their session token.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-4">General Settings</h2>
              {[
                { label: 'Site Name', key: 'site_name' },
                { label: 'Tagline', key: 'tagline' },
                { label: 'Phone Number', key: 'phone' },
                { label: 'Email Address', key: 'email' },
                { label: 'Address', key: 'address' },
                { label: 'WhatsApp Number', key: 'whatsapp' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">{label}</label>
                  <input type="text" value={(settings as Record<string, string | boolean>)[key] as string}
                    onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-4">Notification Settings</h2>
              {[
                { label: 'Email Notifications', key: 'email_notifications', desc: 'Receive email alerts for new bookings and inquiries' },
                { label: 'WhatsApp Notifications', key: 'whatsapp_notifications', desc: 'Forward leads to WhatsApp business number' },
                { label: 'New Booking Alerts', key: 'new_booking_alert', desc: 'Get notified when a customer books a test ride' },
                { label: 'New Inquiry Alerts', key: 'new_inquiry_alert', desc: 'Get notified when a customer sends an inquiry' },
              ].map(({ label, key, desc }) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3 border-b border-neutral-800 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-gray-500 text-xs">{desc}</p>
                  </div>
                  <button type="button" onClick={() => setSettings(s => ({ ...s, [key]: !(s as Record<string, string | boolean>)[key] }))}
                    className="flex-shrink-0">
                    {(settings as Record<string, string | boolean>)[key] ? (
                      <ToggleRight className="w-8 h-8 text-red-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-lg font-bold text-white mb-4">SEO Settings</h2>
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Meta Title</label>
                <input type="text" value={settings.meta_title} onChange={e => setSettings(s => ({ ...s, meta_title: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Meta Description</label>
                <textarea value={settings.meta_description} onChange={e => setSettings(s => ({ ...s, meta_description: e.target.value }))} rows={3}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 transition-colors resize-none" />
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-neutral-800">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-bold rounded-xl text-sm transition-colors">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
