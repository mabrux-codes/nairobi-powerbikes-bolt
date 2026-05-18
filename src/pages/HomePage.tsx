import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, CreditCard, Headphones, Star, ChevronDown, TrendingUp, Users, Package, Award } from 'lucide-react';
import { supabase, Bike, Testimonial } from '../lib/supabase';
import BikeCard from '../components/ui/BikeCard';

const heroImages = [
  'https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg',
  'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg',
  'https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg',
];

const stats = [
  { label: 'Bikes Sold', value: '500+', icon: Package },
  { label: 'Happy Customers', value: '480+', icon: Users },
  { label: 'Brands Available', value: '12+', icon: Award },
  { label: 'Years in Business', value: '8+', icon: TrendingUp },
];

const whyUs = [
  { icon: Shield, title: 'Verified Ownership', desc: 'All bikes come with clean, verified ownership documents and full import documentation.' },
  { icon: Package, title: 'Premium Imported Bikes', desc: 'Direct imports from Japan, Europe, and the USA — certified authentic with full service history.' },
  { icon: CreditCard, title: 'Flexible Payment Plans', desc: 'Affordable financing options tailored to your budget with competitive interest rates.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Professional secure delivery to any location in Kenya with full insurance coverage.' },
  { icon: Headphones, title: 'Professional Support', desc: '24/7 after-sales support from our team of certified motorcycle technicians and advisors.' },
];

const brandLogos = [
  { name: 'Yamaha', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Yamaha_Motor_logo.svg/200px-Yamaha_Motor_logo.svg.png' },
  { name: 'Honda', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/200px-Honda.svg.png' },
  { name: 'Kawasaki', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Kawasaki_motorcycles_logo.svg/200px-Kawasaki_motorcycles_logo.svg.png' },
  { name: 'Suzuki', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/200px-Suzuki_logo_2.svg.png' },
  { name: 'Ducati', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ducati_red_logo.PNG/200px-Ducati_red_logo.PNG' },
  { name: 'KTM', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/KTM-Logo.svg/200px-KTM-Logo.svg.png' },
  { name: 'BMW', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/160px-BMW.svg.png' },
  { name: 'Aprilia', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Aprilia-logo.svg/200px-Aprilia-logo.svg.png' },
];

export default function HomePage() {
  const [featuredBikes, setFeaturedBikes] = useState<Bike[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    supabase.from('bikes').select('*, brand:brands(*)').eq('is_featured', true).limit(8).then(({ data }) => {
      if (data) setFeaturedBikes(data as Bike[]);
    });
    supabase.from('testimonials').select('*').eq('is_featured', true).eq('is_approved', true).limit(5).then(({ data }) => {
      if (data) setTestimonials(data as Testimonial[]);
    });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    await supabase.from('newsletter_subscribers').insert({ email: newsletterEmail });
    setNewsletterSent(true);
    setNewsletterEmail('');
  }

  return (
    <main className="bg-neutral-950 min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} alt="Hero" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/30 to-neutral-950" />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full text-red-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Kenya's #1 Premium Motorcycle Dealership
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6">
            Ride Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Dream Machine</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">Premium Sports Bikes and Superbikes in Kenya</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bikes" className="group px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-600/30">
              View Bikes <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/booking" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold text-base rounded-xl transition-all duration-200">
              Book a Test Ride
            </Link>
            <Link to="/contact" className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-bold text-base rounded-xl transition-all duration-200">
              Contact Us
            </Link>
          </div>
        </div>
        <button onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
        <div className="absolute bottom-10 right-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIndex ? 'bg-red-500 w-6' : 'bg-white/30 hover:bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 bg-neutral-900/50 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className={`text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-gray-400 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bikes */}
      <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-red-400 font-semibold text-sm tracking-wider uppercase mb-2">Hot Right Now</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white">Featured Bikes</h2>
          </div>
          <Link to="/bikes" className="hidden sm:flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {featuredBikes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredBikes.map(bike => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 animate-pulse">
                <div className="aspect-[16/10] bg-neutral-800" />
                <div className="p-5 space-y-3"><div className="h-4 bg-neutral-800 rounded w-3/4" /><div className="h-3 bg-neutral-800 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        )}
        <div className="sm:hidden mt-6 text-center">
          <Link to="/bikes" className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold">View all bikes <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-red-400 font-semibold text-sm tracking-wider uppercase mb-2">Why Us</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Why Choose Nairobi Powerbikes</h2>
            <p className="text-gray-400 max-w-xl mx-auto">We set the standard for premium motorcycle sales in Kenya with transparent processes and genuine care for every rider.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-neutral-900 border border-neutral-800 hover:border-red-500/40 rounded-2xl p-6 text-center group transition-all hover:shadow-lg hover:shadow-red-500/5 hover:-translate-y-1 duration-300">
                <div className="w-14 h-14 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/20 transition-colors">
                  <Icon className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-400 font-semibold text-sm tracking-wider uppercase mb-2">Top Manufacturers</p>
            <h2 className="text-4xl font-black text-white mb-4">Our Brands</h2>
            <p className="text-gray-400">We stock the world's finest motorcycle brands, all verified and imported directly.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brandLogos.map(brand => (
              <Link key={brand.name} to={`/brands#${brand.name.toLowerCase()}`}
                className="bg-neutral-900 border border-neutral-800 hover:border-red-500/40 rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:shadow-lg hover:shadow-red-500/5 group hover:-translate-y-1 duration-300">
                <img src={brand.img} alt={brand.name} className="h-8 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" />
                <span className="text-xs text-gray-500 group-hover:text-gray-300 font-medium transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/brands" className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 hover:border-red-500/50 text-gray-300 hover:text-white rounded-xl transition-all text-sm font-semibold">
              View All Brands <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-neutral-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-red-400 font-semibold text-sm tracking-wider uppercase mb-2">What Riders Say</p>
              <h2 className="text-4xl font-black text-white">Customer Reviews</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map(t => (
                <div key={t.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600/20 border border-red-600/30 rounded-full flex items-center justify-center text-red-400 font-bold text-sm">
                      {t.user_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{t.user_name}</p>
                      {t.bike_purchased && <p className="text-gray-500 text-xs">{t.bike_purchased}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-600/20 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.1)_0%,_transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Ready to Own Your<br />Next Superbike?</h2>
              <p className="text-gray-400 text-lg mb-8">Browse our curated selection of premium motorcycles. Flexible financing available.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/bikes" className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-red-600/30">Browse Inventory</Link>
                <Link to="/booking" className="px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-bold rounded-xl transition-all">Schedule a Test Ride</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-800">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-black text-white mb-2">Stay in the Loop</h3>
          <p className="text-gray-400 text-sm mb-6">Get notified about new arrivals, exclusive deals, and riding events.</p>
          {newsletterSent ? (
            <p className="text-emerald-400 font-semibold">You're subscribed! Welcome to the Nairobi Powerbikes community.</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-3">
              <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" required
                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors" />
              <button type="submit" className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors text-sm whitespace-nowrap">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
