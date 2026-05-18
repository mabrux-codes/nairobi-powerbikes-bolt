import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Post = { id: string; title: string; slug: string; excerpt: string; cover_image_url: string; author: string; tags: string[]; created_at: string };

const placeholderPosts: Post[] = [
  { id: '1', title: 'Top 5 Superbikes You Can Buy in Kenya Right Now', slug: 'top-5-superbikes-kenya', excerpt: 'From the Kawasaki Ninja ZX-10R to the Ducati Panigale V4, we break down the top superbikes currently available in Nairobi.', cover_image_url: 'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg', author: 'David Kimani', tags: ['superbikes', 'review'], created_at: '2024-01-15' },
  { id: '2', title: 'Adventure Riding in Kenya: The Best Routes for 2024', slug: 'adventure-riding-kenya-2024', excerpt: "Kenya offers some of Africa's most spectacular riding terrain. Discover the ultimate adventure routes.", cover_image_url: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg', author: 'Mike Otieno', tags: ['adventure', 'routes'], created_at: '2024-02-03' },
  { id: '3', title: 'Financing Your Dream Motorcycle: A Complete Guide', slug: 'motorcycle-financing-guide-kenya', excerpt: "Owning a premium motorcycle in Kenya doesn't have to be out of reach. Our comprehensive guide walks you through all financing options.", cover_image_url: 'https://images.pexels.com/photos/258092/pexels-photo-258092.jpeg', author: 'Grace Njeri', tags: ['financing', 'guide'], created_at: '2024-02-20' },
  { id: '4', title: 'Yamaha MT-09 vs Kawasaki Z900: Naked Bike Showdown', slug: 'yamaha-mt09-vs-kawasaki-z900', excerpt: 'Two of the most exciting naked bikes go head to head. We put both through their paces on Kenyan roads.', cover_image_url: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg', author: 'David Kimani', tags: ['comparison', 'yamaha'], created_at: '2024-03-10' },
  { id: '5', title: 'Essential Motorcycle Gear for Kenyan Riders', slug: 'essential-motorcycle-gear-kenya', excerpt: 'Safety is paramount on Kenyan roads. We review the best gear available locally and what every serious rider should invest in.', cover_image_url: 'https://images.pexels.com/photos/1005413/pexels-photo-1005413.jpeg', author: 'Amina Hassan', tags: ['gear', 'safety'], created_at: '2024-03-28' },
  { id: '6', title: 'BMW S1000RR Review: The Ultimate Track Day Machine', slug: 'bmw-s1000rr-review-2024', excerpt: "We spent two weeks with the latest BMW S1000RR. Here's our in-depth review covering its real-world performance on Kenyan tarmac.", cover_image_url: 'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg', author: 'David Kimani', tags: ['review', 'bmw'], created_at: '2024-04-15' },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false }).then(({ data }) => {
      setPosts(data?.length ? (data as Post[]) : placeholderPosts);
      setLoading(false);
    });
  }, []);

  const [featured, ...rest] = posts;

  return (
    <main className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">Latest Posts</p>
          <h1 className="text-5xl font-display font-black tracking-tight text-white">Blog & News</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="group block card-premium overflow-hidden mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-[16/9] lg:aspect-auto overflow-hidden">
                    <img
                      src={featured.cover_image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#111]">
                    <div className="flex gap-2 mb-5">
                      {featured.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-white mb-4 group-hover:text-red-300 transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-8">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-gray-500 text-xs">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{featured.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(featured.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <span className="flex items-center gap-1.5 text-red-400 font-display font-semibold text-sm group-hover:gap-2.5 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest Label */}
            {rest.length > 0 && (
              <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-6">More Articles</p>
            )}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block card-premium overflow-hidden hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 bg-[#111]">
                    <div className="flex gap-2 mb-3">
                      {post.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-display font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-white font-display font-black tracking-tight text-lg mb-3 group-hover:text-red-300 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-gray-500 text-xs pt-4 border-t border-white/5">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
