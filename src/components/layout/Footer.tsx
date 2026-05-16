import { Link } from 'react-router-dom';
import { Bike, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-white font-black text-lg leading-tight">NAIROBI</span>
                <span className="block text-blue-400 font-bold text-xs tracking-[0.2em] leading-tight">POWERBIKES</span>
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
                  className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                ['Home', '/'], ['Browse Bikes', '/bikes'], ['Our Brands', '/brands'],
                ['About Us', '/about'], ['Book Test Ride', '/booking'], ['Blog & News', '/blog'], ['Contact', '/contact'],
              ].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-gray-400 hover:text-blue-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Categories</h4>
            <ul className="space-y-3">
              {[
                ['Sports Bikes', '/bikes?type=sports'], ['Naked Bikes', '/bikes?type=naked'],
                ['Adventure Bikes', '/bikes?type=adventure'], ['Cruisers', '/bikes?type=cruiser'],
                ['Touring Bikes', '/bikes?type=touring'], ['New Arrivals', '/bikes?condition=new'],
                ['Used Bikes', '/bikes?condition=used'],
              ].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-gray-400 hover:text-blue-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Westlands Road, Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+254700000000" className="text-gray-400 hover:text-white text-sm transition-colors">+254 700 000 000</a>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@nairobipowerbikes.co.ke" className="text-gray-400 hover:text-white text-sm transition-colors">info@nairobipowerbikes.co.ke</a>
              </li>
              <li>
                <a href="https://wa.me/254700000000?text=Hi%2C%20I%20am%20interested%20in%20a%20motorcycle"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors w-fit">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Nairobi Powerbikes. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
