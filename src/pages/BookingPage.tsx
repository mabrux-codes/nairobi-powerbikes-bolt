import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, ChevronDown } from 'lucide-react';
import { supabase, Bike } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const timeSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    bike_id: searchParams.get('bike') || '',
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: user?.email || '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  });

  useEffect(() => {
    supabase.from('bikes').select('id, name, model_year, brand:brands(name)').eq('status', 'available').then(({ data }) => {
      if (data) setBikes(data as Bike[]);
    });
  }, []);

  useEffect(() => {
    if (profile) setForm(f => ({ ...f, full_name: profile.full_name || '', phone: profile.phone || '' }));
    if (user?.email) setForm(f => ({ ...f, email: user.email || '' }));
  }, [profile, user]);

  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('test_ride_bookings').insert({ ...form, bike_id: form.bike_id || null, user_id: user?.id || null });
    setLoading(false);
    if (!error) setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="bg-neutral-950 min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-emerald-400 text-4xl">&#10003;</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">Your test ride request has been submitted. Our team will contact you within 24 hours.</p>
          <div className="grid grid-cols-2 gap-3">
            <a href="/" className="px-5 py-3 border border-neutral-700 hover:border-neutral-500 text-white font-semibold rounded-xl transition-colors text-sm">Go Home</a>
            <a href="/bikes" className="px-5 py-3 bg-red-600 hover:bg-red-400 text-white font-semibold rounded-xl transition-colors text-sm">Browse More</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-neutral-950 min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-red-400 font-semibold text-sm tracking-wider uppercase mb-2">Schedule Your Ride</p>
          <h1 className="text-4xl font-black text-white mb-3">Book a Test Ride</h1>
          <p className="text-gray-400">Fill out the form below and our team will confirm your booking within 24 hours.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 text-sm font-black">1</div> Select Motorcycle
            </h2>
            <div className="relative">
              <select value={form.bike_id} onChange={e => setForm(f => ({ ...f, bike_id: e.target.value }))}
                className="w-full appearance-none pl-4 pr-10 py-3.5 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 cursor-pointer">
                <option value="">-- Any bike (we'll recommend one) --</option>
                {bikes.map(b => <option key={b.id} value={b.id}>{b.model_year} {(b.brand as { name: string } | undefined)?.name} {b.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 text-sm font-black">2</div> Choose Date & Time
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2"><Calendar className="w-3 h-3 inline mr-1" />Preferred Date *</label>
                <input type="date" required min={today} value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2"><Clock className="w-3 h-3 inline mr-1" />Preferred Time *</label>
                <div className="relative">
                  <select required value={form.preferred_time} onChange={e => setForm(f => ({ ...f, preferred_time: e.target.value }))}
                    className="w-full appearance-none pl-4 pr-10 py-3 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl focus:outline-none focus:border-red-600 cursor-pointer">
                    <option value="">-- Select time --</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 text-sm font-black">3</div> Your Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2"><User className="w-3 h-3 inline mr-1" />Full Name *</label>
                <input type="text" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="John Doe"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-red-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2"><Phone className="w-3 h-3 inline mr-1" />Phone Number *</label>
                <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 700 000 000"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-red-600" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2"><Mail className="w-3 h-3 inline mr-1" />Email Address *</label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-red-600" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2"><FileText className="w-3 h-3 inline mr-1" />Additional Notes</label>
                <textarea value={form.notes} rows={3} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-red-600 resize-none"
                  placeholder="Any additional requirements or questions..." />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-400 disabled:bg-red-600/50 text-white font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</> : <><Calendar className="w-5 h-5" />Confirm Test Ride Booking</>}
          </button>
          <p className="text-center text-xs text-gray-500">By submitting this form you agree to our terms. A valid driver's license is required on the day of the test ride.</p>
        </form>
      </div>
    </main>
  );
}
