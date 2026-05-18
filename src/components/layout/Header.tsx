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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-neutral-950/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="block text-white font-black text-lg leading-tight tracking-tight">NAIROBI</span>
              <span className="block text-red-400 font-bold text-xs tracking-[0.2em] uppercase leading-tight">POWERBIKES</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-red-400' : 'text-gray-300 hover:text-white'}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/booking" className="px-4 py-2 text-sm font-semibold text-red-400 border border-red-600/50 rounded-lg hover:bg-red-600/10 transition-all">
              Book Test Ride
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
                  <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden">
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-neutral-800 transition-colors border-b border-neutral-700">
                        <Settings className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neutral-800 transition-colors">
                      <User className="w-4 h-4" /> My Dashboard
                    </Link>
                    <Link to="/dashboard/wishlist" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-neutral-800 transition-colors">
                      <Heart className="w-4 h-4" /> Saved Bikes
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-neutral-800 transition-colors border-t border-neutral-700">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-300 hover:text-white">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-neutral-950 border-t border-neutral-800">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-red-400 bg-red-600/10' : 'text-gray-300 hover:text-white hover:bg-neutral-800'}`}>
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-neutral-800">
              <Link to="/booking" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-center text-sm font-semibold text-red-400 border border-red-600/50 rounded-lg">Book Test Ride</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-center text-sm font-semibold bg-neutral-800 text-white rounded-lg">My Dashboard</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-center text-sm font-semibold bg-red-600/10 text-red-400 rounded-lg">Admin Dashboard</Link>
                  )}
                  <button onClick={handleSignOut} className="px-4 py-3 text-center text-sm font-semibold text-red-400 bg-red-600/10 rounded-lg">Sign Out</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-center text-sm font-semibold bg-red-600 text-white rounded-lg">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
