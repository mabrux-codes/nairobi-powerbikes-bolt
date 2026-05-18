import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Heart, Settings, Bike } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Bikes', to: '/bikes' },
  { label: 'Brands', to: '/brands' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/');
    setUserMenuOpen(false);
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.8)] border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center group-hover:from-red-500 group-hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-600/20">
              <Bike className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            </div>
            <div>
              <span className="block text-white font-display font-black text-lg leading-tight tracking-wider">NAIROBI</span>
              <span className="block text-red-500 font-display font-bold text-[10px] tracking-[0.3em] leading-tight">POWERBIKES</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 ${isActive ? 'text-red-400 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/booking" className="btn-outline px-5 py-2.5 text-sm font-display font-bold tracking-wider uppercase text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50">
              Book Test Ride
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-md shadow-red-500/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-white text-sm font-semibold truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-semibold">
                        <Settings className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" /> My Dashboard
                    </Link>
                    <Link to="/dashboard/wishlist" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <Heart className="w-4 h-4" /> Saved Bikes
                    </Link>
                    <div className="border-t border-white/5">
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-semibold">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="btn-primary px-5 py-2.5 text-sm font-display font-bold tracking-wider uppercase">
                Sign In
              </Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-t border-white/5">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${isActive ? 'text-red-400 bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/5">
              <Link to="/booking" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-center text-sm font-display font-bold tracking-wider uppercase text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10">Book Test Ride</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-center text-sm font-semibold bg-white/5 text-white rounded-xl">My Dashboard</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-center text-sm font-semibold bg-red-500/10 text-red-400 rounded-xl">Admin Dashboard</Link>
                  )}
                  <button onClick={handleSignOut} className="px-4 py-3 text-center text-sm font-semibold text-red-400 bg-red-500/10 rounded-xl">Sign Out</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  className="btn-primary px-4 py-3 text-center text-sm font-display font-bold tracking-wider uppercase">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
