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
  { label: 'Happy Riders', value: '480+', icon: Users },
  { label: 'Brands', value: '12+', icon: Award },
  { label: 'Years', value: '8+', icon: TrendingUp },
];

const whyUs = [
  { icon: Shield, title: 'Verified Ownership', desc: 'All bikes come with clean, verified ownership documents and full import documentation.' },
  { icon: Package, title: 'Premium Imports', desc: 'Direct imports from Japan, Europe, and the USA — certified authentic with full service history.' },
  { icon: CreditCard, title: 'Flexible Financing', desc: 'Affordable financing options tailored to your budget with competitive interest rates.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Professional secure delivery to any location in Kenya with full insurance coverage.' },
  { icon: Headphones, title: 'Expert Support', desc: '24/7 after-sales support from our team of certified motorcycle technicians and advisors.' },
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
    <main className="bg-[#0a0a0a] min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} alt="Hero" className="w-full h-full object-cover scale-105" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/40 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.4)_100%)]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600/15 border border-red-500/20 rounded-full text-red-300 text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-red" />
            <span className="font-display tracking-wider uppercase text-xs">Kenya's #1 Premium Motorcycle Dealership</span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-[5.5rem] text-white leading-[0.9] tracking-tight mb-8">
            RIDE YOUR<br />
            <span className="text-gradient-red">DREAM MACHINE</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">Premium Sports Bikes and Superbikes in Kenya</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bikes" className="btn-primary group px-10 py-4 text-base font-display font-bold tracking-wider uppercase flex items-center justify-center gap-3">
              View Bikes <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link to="/booking" className="btn-outline px-10 py-4 text-base font-display font-bold tracking-wider uppercase">
              Book a Test Ride
            </Link>
            <Link to="/contact" className="px-10 py-4 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-display font-bold text-base rounded-xl tracking-wider uppercase transition-all duration-300">
              Contact Us
            </Link>
          </div>
        </div>

        <button onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors duration-300">
          <span className="text-[10px] font-display tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
        <div className="absolute bottom-10 right-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === heroIndex ? 'bg-red-500 w-8' : 'bg-white/20 w-4 hover:bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="relative py-20 bg-[#0a0a0a]">
        <div className="absolute inset-0 carbon-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon }, i) => (
              <div key={label} className={`text-center transition-all duration-700 delay-${i * 100} ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-5xl font-display font-black text-white mb-2">{value}</p>
                <p className="text-gray-500 text-sm font-display font-semibold tracking-wider uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Featured Bikes */}
      <section id="featured" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">Hot Right Now</p>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tight">Featured Bikes</h2>
          </div>
          <Link to="/bikes" className="hidden sm:flex items-center gap-2 text-red-400 hover:text-red-300 font-display font-bold text-sm tracking-wider uppercase transition-colors">
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
              <div key={i} className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
                <div className="aspect-[16/10] bg-[#0a0a0a]" />
                <div className="p-5 space-y-3"><div className="h-4 bg-white/5 rounded w-3/4" /><div className="h-3 bg-white/5 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        )}
        <div className="sm:hidden mt-8 text-center">
          <Link to="/bikes" className="inline-flex items-center gap-2 text-red-400 font-display font-bold text-sm tracking-wider uppercase">View all bikes <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* Why Choose Us - Angled Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#111]" />
        <div className="absolute inset-0 carbon-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#0a0a0a] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">Why Us</p>
            <h2 className="text-4xl lg:text-5xl font-display font-black text-white tracking-tight mb-4">Why Choose Nairobi Powerbikes</h2>
            <p className="text-gray-400 max-w-xl mx-auto">We set the standard for premium motorcycle sales in Kenya with transparent processes and genuine care for every rider.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-premium p-6 text-center group">
                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-all duration-300">
                  <Icon className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">Top Manufacturers</p>
            <h2 className="text-4xl font-display font-black text-white tracking-tight mb-4">Our Brands</h2>
            <p className="text-gray-400">We stock the world's finest motorcycle brands, all verified and imported directly.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brandLogos.map(brand => (
              <Link key={brand.name} to={`/brands#${brand.name.toLowerCase()}`}
                className="card-premium p-5 flex flex-col items-center gap-3 group">
                <img src={brand.img} alt={brand.name} className="h-8 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100" />
                <span className="text-[10px] text-gray-500 group-hover:text-gray-300 font-display font-semibold tracking-wider uppercase transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/brands" className="btn-outline inline-flex items-center gap-2 px-8 py-3 text-sm font-display font-bold tracking-wider uppercase">
              View All Brands <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-[#111] relative">
          <div className="absolute inset-0 carbon-bg opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">What Riders Say</p>
              <h2 className="text-4xl font-display font-black text-white tracking-tight">Customer Reviews</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map(t => (
                <div key={t.id} className="card-premium p-7">
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.review}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-display font-bold text-sm shadow-lg shadow-red-500/20">
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
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-[#0a0a0a] to-red-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(220,38,38,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 carbon-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-display font-black text-white tracking-tight mb-6">READY TO OWN YOUR<br /><span className="text-gradient-red">NEXT SUPERBIKE?</span></h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Browse our curated selection of premium motorcycles. Flexible financing available.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/bikes" className="btn-primary px-10 py-4 text-base font-display font-bold tracking-wider uppercase">Browse Inventory</Link>
            <Link to="/booking" className="btn-outline px-10 py-4 text-base font-display font-bold tracking-wider uppercase">Schedule a Test Ride</Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#111] relative">
        <div className="absolute inset-0 carbon-bg opacity-20" />
        <div className="relative max-w-xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-display font-black text-white tracking-tight mb-3">Stay in the Loop</h3>
          <p className="text-gray-400 text-sm mb-8">Get notified about new arrivals, exclusive deals, and riding events.</p>
          {newsletterSent ? (
            <p className="text-emerald-400 font-semibold font-display tracking-wider">You're subscribed! Welcome to the community.</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-3">
              <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Enter your email address" required
                className="input-premium flex-1" />
              <button type="submit" className="btn-primary px-6 py-3 text-sm font-display font-bold tracking-wider uppercase whitespace-nowrap">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
