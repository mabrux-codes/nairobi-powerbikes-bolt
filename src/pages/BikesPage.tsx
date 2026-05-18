import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { supabase, Bike, Brand } from '../lib/supabase';
import BikeCard from '../components/ui/BikeCard';

const bikeTypes = ['sports', 'naked', 'adventure', 'cruiser', 'touring', 'supermoto', 'scooter', 'other'];
const conditions = ['new', 'used', 'demo'];
const transmissions = ['manual', 'automatic', 'semi-automatic'];

export default function BikesPage() {
  const [searchParams] = useSearchParams();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || '');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    supabase.from('brands').select('*').order('sort_order').then(({ data }) => {
      if (data) setBrands(data as Brand[]);
    });
  }, []);

  useEffect(() => { fetchBikes(); }, [selectedBrand, selectedType, selectedCondition, selectedTransmission, minPrice, maxPrice, sortBy]);

  async function fetchBikes() {
    setLoading(true);
    let query = supabase.from('bikes').select('*, brand:brands(*)').neq('status', 'sold');
    if (selectedBrand) query = query.eq('brand_id', selectedBrand);
    if (selectedType) query = query.eq('bike_type', selectedType);
    if (selectedCondition) query = query.eq('condition', selectedCondition);
    if (selectedTransmission) query = query.eq('transmission', selectedTransmission);
    if (minPrice) query = query.gte('price', Number(minPrice));
    if (maxPrice) query = query.lte('price', Number(maxPrice));
    if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });
    const { data } = await query;
    let results = (data as Bike[]) || [];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(b => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    }
    setBikes(results);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) { e.preventDefault(); fetchBikes(); }

  function clearFilters() {
    setSelectedBrand(''); setSelectedType(''); setSelectedCondition('');
    setSelectedTransmission(''); setMinPrice(''); setMaxPrice(''); setSearch('');
  }

  const hasFilters = selectedBrand || selectedType || selectedCondition || selectedTransmission || minPrice || maxPrice || search;

  return (
    <main className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Browse Inventory</p>
          <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-white mb-4">All Motorcycles</h1>
          <p className="text-gray-400">Find your perfect ride from our curated collection of premium bikes.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bikes by name, brand..."
                className="input-premium w-full pl-10 pr-4 py-3" />
            </div>
            <button type="submit" className="btn-primary px-5 py-3 font-display text-sm">Search</button>
          </form>
          <div className="flex gap-2">
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 hover:border-red-500/30 appearance-none pl-4 pr-10 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-red-500/30 cursor-pointer transition-colors">
                <option value="created_at">Latest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:border-red-500/30 text-white text-sm font-display font-semibold rounded-xl transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filters {hasFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-display font-bold">Filter Bikes</h3>
              {hasFilters && <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"><X className="w-4 h-4" /> Clear all</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Brand</label>
                <div className="relative">
                  <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}
                    className="input-premium w-full appearance-none pl-3 pr-8 py-2.5 cursor-pointer">
                    <option value="">All Brands</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Bike Type</label>
                <div className="relative">
                  <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                    className="input-premium w-full appearance-none pl-3 pr-8 py-2.5 cursor-pointer capitalize">
                    <option value="">All Types</option>
                    {bikeTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Condition</label>
                <div className="relative">
                  <select value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)}
                    className="input-premium w-full appearance-none pl-3 pr-8 py-2.5 cursor-pointer">
                    <option value="">Any Condition</option>
                    {conditions.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Transmission</label>
                <div className="relative">
                  <select value={selectedTransmission} onChange={e => setSelectedTransmission(e.target.value)}
                    className="input-premium w-full appearance-none pl-3 pr-8 py-2.5 cursor-pointer">
                    <option value="">Any Transmission</option>
                    {transmissions.map(t => <option key={t} value={t} className="capitalize">{t.replace('-', ' ')}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">Price Range (KES)</label>
                <div className="flex gap-3 items-center">
                  <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min price"
                    className="input-premium flex-1 px-3 py-2.5" />
                  <span className="text-gray-600 text-sm">—</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max price"
                    className="input-premium flex-1 px-3 py-2.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">{loading ? 'Loading...' : `${bikes.length} bike${bikes.length !== 1 ? 's' : ''} found`}</p>
          {hasFilters && <button onClick={clearFilters} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Clear filters</button>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-white/5" /><div className="p-5 space-y-3"><div className="h-4 bg-white/5 rounded w-3/4" /><div className="h-3 bg-white/5 rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : bikes.length === 0 ? (
          <div className="card-premium text-center py-24">
            <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-600" /></div>
            <h3 className="text-white font-display font-bold text-xl mb-2">No bikes found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
            <button onClick={clearFilters} className="btn-primary px-6 py-3 font-display font-semibold">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bikes.map(bike => <BikeCard key={bike.id} bike={bike} />)}
          </div>
        )}
      </div>
    </main>
  );
}
