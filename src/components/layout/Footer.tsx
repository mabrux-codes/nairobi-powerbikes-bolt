import { Link } from 'react-router-dom';
import { Bike, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter, MessageCircle, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] relative">
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-11 h-11 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                <Bike className="w-6 h-6 text-white" />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              </div>
              <div>
                <span className="block text-white font-display font-black text-lg leading-tight tracking-wider">NAIROBI</span>
                <span className="block text-red-500 font-display font-bold text-[10px] tracking-[0.3em] leading-tight">POWERBIKES</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Kenya's premier destination for premium motorcycles. Imported superbikes, sports bikes, and adventure motorcycles with verified documentation.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs tracking-[0.2em] uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                ['Home', '/'], ['Browse Bikes', '/bikes'], ['Our Brands', '/brands'],
                ['About Us', '/about'], ['Book Test Ride', '/booking'], ['Blog & News', '/blog'], ['Contact', '/contact'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-red-400 text-sm transition-colors duration-300 flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs tracking-[0.2em] uppercase mb-6">Categories</h4>
            <ul className="space-y-3">
              {[
                ['Sports Bikes', '/bikes?type=sports'], ['Naked Bikes', '/bikes?type=naked'],
                ['Adventure Bikes', '/bikes?type=adventure'], ['Cruisers', '/bikes?type=cruiser'],
                ['Touring Bikes', '/bikes?type=touring'], ['New Arrivals', '/bikes?condition=new'],
                ['Used Bikes', '/bikes?condition=used'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-red-400 text-sm transition-colors duration-300 flex items-center gap-2 group">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-bold text-xs tracking-[0.2em] uppercase mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-gray-400 text-sm">Westlands Road, Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex gap-3">
                <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-red-400" />
                </div>
                <a href="tel:+254700000000" className="text-gray-400 hover:text-white text-sm transition-colors">+254 700 000 000</a>
              </li>
              <li className="flex gap-3">
                <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-red-400" />
                </div>
                <a href="mailto:info@nairobipowerbikes.co.ke" className="text-gray-400 hover:text-white text-sm transition-colors">info@nairobipowerbikes.co.ke</a>
              </li>
              <li>
                <a href="https://wa.me/254700000000?text=Hi%2C%20I%20am%20interested%20in%20a%20motorcycle"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-green-600/20">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Nairobi Powerbikes. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-300 text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-300 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
