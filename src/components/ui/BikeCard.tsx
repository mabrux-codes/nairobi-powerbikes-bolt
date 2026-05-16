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
    : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

  return (
    <Link to={`/bikes/${bike.slug}`} className="group block bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
        <img src={bike.cover_image_url || 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg'} alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize ${condColor}`}>{bike.condition}</span>
          {bike.is_featured && <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Featured</span>}
          {bike.status === 'sold' && <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Sold</span>}
          {bike.status === 'reserved' && <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">Reserved</span>}
        </div>
        {user && (
          <button onClick={toggleWishlist} disabled={toggling}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-black/40 backdrop-blur-sm text-white hover:bg-red-500'}`}>
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">{bike.brand?.name}</p>
            <h3 className="text-white font-bold text-base leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">{bike.name}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-blue-400 font-black text-lg">KES {bike.price.toLocaleString()}</p>
            {bike.financing_available && <p className="text-xs text-gray-500">Financing available</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">{bike.engine_size || '—'}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">{bike.condition === 'new' ? 'New' : `${bike.mileage.toLocaleString()} km`}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">{bike.model_year}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-zinc-800/50">
          <Eye className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs text-gray-600">{bike.views} views</span>
          <span className="ml-auto text-xs font-medium text-blue-400 group-hover:underline">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
