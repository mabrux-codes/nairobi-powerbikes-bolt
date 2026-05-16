import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Calendar, Zap, Gauge, Scale, Fuel, ChevronLeft, ChevronRight, ExternalLink, Share2 } from 'lucide-react';
import { supabase, Bike } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import BikeCard from '../components/ui/BikeCard';

export default function BikeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [bike, setBike] = useState<Bike | null>(null);
  const [similarBikes, setSimilarBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from('bikes').select('*, brand:brands(*), bike_images(*)').eq('slug', slug).maybeSingle();
      if (data) {
        const b = data as Bike;
        setBike(b);
        const imgs: string[] = b.bike_images?.map(i => i.image_url) || [];
        if (b.cover_image_url && !imgs.includes(b.cover_image_url)) imgs.unshift(b.cover_image_url);
        setAllImages(imgs.length ? imgs : ['https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg']);
        await supabase.from('bikes').update({ views: (b.views || 0) + 1 }).eq('id', b.id);
        const { data: similar } = await supabase.from('bikes').select('*, brand:brands(*)').eq('bike_type', b.bike_type).neq('id', b.id).limit(4);
        if (similar) setSimilarBikes(similar as Bike[]);
        if (user) {
          const { data: wl } = await supabase.from('wishlist').select('id').eq('user_id', user.id).eq('bike_id', b.id).maybeSingle();
          setWishlisted(!!wl);
        }
      }
      setLoading(false);
    })();
  }, [slug, user]);

  async function toggleWishlist() {
    if (!user || !bike) return;
    if (wishlisted) { await supabase.from('wishlist').delete().eq('user_id', user.id).eq('bike_id', bike.id); }
    else { await supabase.from('wishlist').insert({ user_id: user.id, bike_id: bike.id }); }
    setWishlisted(!wishlisted);
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!bike) return;
    await supabase.from('inquiries').insert({ bike_id: bike.id, user_id: user?.id || null, full_name: inquiryForm.name, phone: inquiryForm.phone, email: inquiryForm.email, message: inquiryForm.message });
    setInquirySent(true);
  }

  if (loading) return <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!bike) return <div className="bg-zinc-950 min-h-screen pt-24 flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-white mb-3">Bike Not Found</h2><Link to="/bikes" className="text-blue-400 hover:text-blue-300">Back to All Bikes</Link></div></div>;

  const specs = [
    { label: 'Engine', value: bike.engine_size, icon: Zap },
    { label: 'Power', value: bike.power, icon: Zap },
    { label: 'Torque', value: bike.torque, icon: Zap },
    { label: 'Top Speed', value: bike.top_speed, icon: Gauge },
    { label: 'Weight', value: bike.weight, icon: Scale },
    { label: 'Seat Height', value: bike.seat_height, icon: Scale },
    { label: 'Fuel Tank', value: bike.fuel_capacity, icon: Fuel },
    { label: 'Transmission', value: bike.transmission?.replace('-', ' '), icon: Gauge },
  ].filter(s => s.value);

  return (
    <main className="bg-zinc-950 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link to="/bikes" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /> All Bikes</Link>
          <span className="text-zinc-700">/</span><span className="text-gray-500">{bike.brand?.name}</span>
          <span className="text-zinc-700">/</span><span className="text-white font-medium truncate">{bike.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 aspect-[4/3] mb-3">
              <img src={allImages[activeImg]} alt={bike.name} className="w-full h-full object-cover" />
              {allImages.length > 1 && (<>
                <button onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setActiveImg(i => (i + 1) % allImages.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70"><ChevronRight className="w-5 h-5" /></button>
              </>)}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">{activeImg + 1} / {allImages.length}</div>
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-blue-500' : 'border-zinc-700 hover:border-zinc-500'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-blue-400 font-semibold text-sm mb-1">{bike.brand?.name} • {bike.model_year}</p>
                <h1 className="text-3xl font-black text-white leading-tight">{bike.name}</h1>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleWishlist} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${wishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-zinc-700 text-gray-400 hover:border-red-500 hover:text-red-400'}`}>
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
                <button onClick={() => navigator.share?.({ title: bike.name, url: window.location.href })} className="w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-700 text-gray-400 hover:border-zinc-500 hover:text-white transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${bike.condition === 'new' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>{bike.condition}</span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize">{bike.bike_type}</span>
              {bike.status !== 'available' && <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 capitalize">{bike.status}</span>}
            </div>
            <div className="mb-6">
              <p className="text-4xl font-black text-white mb-1">KES {bike.price.toLocaleString()}</p>
              {bike.financing_available && <p className="text-sm text-green-400">Financing available — contact us for payment plans</p>}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{bike.description}</p>
            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {specs.map(({ label, value }) => (
                  <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                    <p className="text-gray-500 text-xs mb-0.5">{label}</p>
                    <p className="text-white text-sm font-semibold capitalize">{value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link to={`/booking?bike=${bike.id}`} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30"><Calendar className="w-5 h-5" /> Book Test Ride</Link>
              <a href={`https://wa.me/254700000000?text=Hi%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(bike.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"><MessageCircle className="w-5 h-5" /> WhatsApp Inquiry</a>
              <button onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-center gap-2 px-6 py-3.5 border border-zinc-700 hover:border-blue-500/50 text-gray-300 hover:text-white font-bold rounded-xl transition-all"><ExternalLink className="w-5 h-5" /> Send Inquiry</button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {specs.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-black text-white mb-5">Specifications</h2>
                <div className="grid grid-cols-2 divide-y divide-zinc-800">
                  {specs.map(({ label, value }, i) => (
                    <div key={label} className={`py-3 ${i % 2 === 0 ? 'pr-4' : 'pl-4'} flex justify-between gap-4`}>
                      <span className="text-gray-500 text-sm">{label}</span>
                      <span className="text-white text-sm font-semibold capitalize text-right">{value}</span>
                    </div>
                  ))}
                  <div className="py-3 pr-4 flex justify-between gap-4"><span className="text-gray-500 text-sm">Year</span><span className="text-white text-sm font-semibold">{bike.model_year}</span></div>
                  <div className="py-3 pl-4 flex justify-between gap-4"><span className="text-gray-500 text-sm">Color</span><span className="text-white text-sm font-semibold">{bike.color}</span></div>
                  {bike.condition !== 'new' && <div className="py-3 pr-4 flex justify-between gap-4"><span className="text-gray-500 text-sm">Mileage</span><span className="text-white text-sm font-semibold">{bike.mileage.toLocaleString()} km</span></div>}
                </div>
              </div>
            )}
            {bike.seller_notes && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-black text-white mb-3">Seller Notes</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{bike.seller_notes}</p>
              </div>
            )}
          </div>

          <div id="inquiry-form">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl font-black text-white mb-5">Send Inquiry</h2>
              {inquirySent ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-emerald-400 text-xl">&#10003;</span></div>
                  <p className="text-white font-semibold">Inquiry Sent!</p><p className="text-gray-400 text-sm mt-1">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={submitInquiry} className="space-y-3">
                  <input type="text" required placeholder="Full Name" value={inquiryForm.name} onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                  <input type="tel" required placeholder="Phone Number" value={inquiryForm.phone} onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                  <input type="email" required placeholder="Email Address" value={inquiryForm.email} onChange={e => setInquiryForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                  <textarea required placeholder="Your message..." value={inquiryForm.message} rows={4} onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500 resize-none" />
                  <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors text-sm">Send Inquiry</button>
                </form>
              )}
            </div>
          </div>
        </div>

        {similarBikes.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-white mb-6">Similar Bikes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarBikes.map(b => <BikeCard key={b.id} bike={b} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
