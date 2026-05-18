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
    <main className="bg-neutral-950 min-h-screen pt-24 pb-20">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 to-neutral-950" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <p className="text-red-400 font-semibold text-sm tracking-wider uppercase mb-3">World-Class Manufacturers</p>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4">Our Brands</h1>
          <p className="text-gray-400 text-xl">We partner with the world's most prestigious motorcycle manufacturers to bring you the finest machines.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="bg-neutral-900 rounded-2xl h-64 animate-pulse border border-neutral-800" />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brands.map(brand => (
              <div key={brand.id} id={brand.name.toLowerCase()} className="bg-neutral-900 border border-neutral-800 hover:border-red-600/40 rounded-2xl p-8 group transition-all hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 duration-300">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 p-3">
                    <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-black text-white group-hover:text-red-300 transition-colors">{brand.name}</h2>
                      <span className="px-2 py-0.5 bg-neutral-800 text-gray-400 text-xs rounded-full">{brand.country_of_origin}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{brand.description}</p>
                    <div className="flex items-center gap-3">
                      <Link to={`/bikes?brand=${brand.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">View Models <ArrowRight className="w-4 h-4" /></Link>
                      {brand.website_url && <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"><Globe className="w-3.5 h-3.5" /> Official Site</a>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Don't See Your Brand?</h2>
          <p className="text-gray-400 mb-8">We can source almost any premium motorcycle brand on request. Contact us with your requirements.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-400 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-red-600/30">Get in Touch <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>
    </main>
  );
}
