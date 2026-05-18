import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { supabase, Brand } from '../lib/supabase';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('brands').select('*').order('sort_order').then(({ data }) => {
      if (data) setBrands(data as Brand[]);
      setLoading(false);
    });
  }, []);

  return (
    <main className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">World-Class Manufacturers</p>
          <h1 className="text-5xl lg:text-6xl font-display font-black tracking-tight text-white mb-4">Our Brands</h1>
          <p className="text-gray-400 text-xl">We partner with the world's most prestigious motorcycle manufacturers to bring you the finest machines.</p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#111] rounded-2xl h-64 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brands.map(brand => (
              <div
                key={brand.id}
                id={brand.name.toLowerCase()}
                className="card-premium group"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-white rounded-xl p-3 w-24 h-20 flex items-center justify-center flex-shrink-0">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-display font-black group-hover:text-red-300 transition-colors">{brand.name}</h2>
                      <span className="bg-white/5 text-gray-400 text-xs rounded-lg px-2 py-0.5">{brand.country_of_origin}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{brand.description}</p>
                    <div className="flex items-center gap-3">
                      <Link to={`/bikes?brand=${brand.id}`} className="btn-primary inline-flex items-center gap-1.5 text-sm">
                        View Models <ArrowRight className="w-4 h-4" />
                      </Link>
                      {brand.website_url && (
                        <a
                          href={brand.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline inline-flex items-center gap-1.5 text-sm"
                        >
                          <Globe className="w-3.5 h-3.5" /> Official Site
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">Can't Find What You Need?</p>
          <h2 className="text-3xl font-display font-black tracking-tight text-white mb-4">Don't See Your Brand?</h2>
          <p className="text-gray-400 mb-8">We can source almost any premium motorcycle brand on request. Contact us with your requirements.</p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            Get in Touch <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
