import { Link } from 'react-router-dom';
import { Heart, Gauge, Zap, Calendar, Eye } from 'lucide-react';
import { Bike } from '../../lib/supabase';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

type Props = { bike: Bike; wishlisted?: boolean; onWishlistToggle?: () => void };

export default function BikeCard({ bike, wishlisted = false, onWishlistToggle }: Props) {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);
  const [toggling, setToggling] = useState(false);

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return;
    setToggling(true);
    if (isWishlisted) {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('bike_id', bike.id);
    } else {
      await supabase.from('wishlist').insert({ user_id: user.id, bike_id: bike.id });
    }
    setIsWishlisted(!isWishlisted);
    setToggling(false);
    onWishlistToggle?.();
  }

  const condColor = bike.condition === 'new'
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : bike.condition === 'used'
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30';

  return (
    <Link to={`/bikes/${bike.slug}`} className="group block card-premium">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
        <img src={bike.cover_image_url || 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'} alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-transparent to-red-600/0 group-hover:from-red-600/10 group-hover:to-transparent transition-all duration-500" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`px-2.5 py-1 text-[10px] font-display font-bold rounded-lg border uppercase tracking-wider ${condColor}`}>{bike.condition}</span>
          {bike.is_featured && <span className="px-2.5 py-1 text-[10px] font-display font-bold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">Featured</span>}
          {bike.status === 'sold' && <span className="px-2.5 py-1 text-[10px] font-display font-bold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">Sold</span>}
          {bike.status === 'reserved' && <span className="px-2.5 py-1 text-[10px] font-display font-bold rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider">Reserved</span>}
        </div>
        {user && (
          <button onClick={toggleWishlist} disabled={toggling}
            className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${isWishlisted ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'bg-black/40 text-white/70 hover:bg-red-500 hover:text-white'}`}>
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      <div className="p-5 carbon-bg">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[10px] text-red-400 font-display font-bold uppercase tracking-[0.15em] mb-1">{bike.brand?.name}</p>
            <h3 className="text-white font-bold text-base leading-tight group-hover:text-red-300 transition-colors duration-300 line-clamp-2">{bike.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-red-400 font-display font-black text-lg">KES {bike.price.toLocaleString()}</p>
            {bike.financing_available && <p className="text-[10px] text-gray-500 font-medium">Financing available</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
          <div className="flex flex-col items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] text-gray-400 font-medium">{bike.engine_size || '—'}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] text-gray-400 font-medium">{bike.condition === 'new' ? 'New' : `${bike.mileage.toLocaleString()} km`}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] text-gray-400 font-medium">{bike.model_year}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/5">
          <Eye className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[11px] text-gray-600">{bike.views} views</span>
          <span className="ml-auto text-xs font-display font-bold text-red-400 group-hover:tracking-wider transition-all duration-300 uppercase">Details →</span>
        </div>
      </div>
    </Link>
  );
}
