import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '', email: user?.email || '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from('inquiries').insert({ full_name: form.full_name, phone: form.phone, email: form.email, message: form.message, user_id: user?.id || null });
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="bg-zinc-950 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <p className="text-blue-400 font-semibold text-sm tracking-wider uppercase mb-2">Get in Touch</p>
        <h1 className="text-5xl font-black text-white mb-3">Contact Us</h1>
        <p className="text-gray-400 text-lg max-w-xl">Visit our showroom, call us, or drop us a message. We'd love to help you find your perfect ride.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: MapPin, title: 'Our Location', content: 'Westlands Road, Westlands\nNairobi, Kenya', link: { label: 'Get Directions →', href: 'https://maps.google.com/?q=Westlands+Nairobi' } },
            { icon: Phone, title: 'Phone', content: '+254 700 000 000\n+254 711 000 000', links: [{ label: '+254 700 000 000', href: 'tel:+254700000000' }, { label: '+254 711 000 000', href: 'tel:+254711000000' }] },
            { icon: Mail, title: 'Email', content: '', links: [{ label: 'info@nairobipowerbikes.co.ke', href: 'mailto:info@nairobipowerbikes.co.ke' }, { label: 'sales@nairobipowerbikes.co.ke', href: 'mailto:sales@nairobipowerbikes.co.ke' }] },
          ].map(({ icon: Icon, title, content, ...rest }) => (
            <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-blue-400" /></div>
                <div>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  {content && <p className="text-gray-400 text-sm whitespace-pre-line">{content}</p>}
                  {rest.link && <a href={rest.link.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-semibold mt-2 inline-block">{rest.link.label}</a>}
                  {rest.links && <div>{rest.links.map((l: { label: string; href: string }) => <a key={l.href} href={l.href} className="text-gray-400 hover:text-white text-sm block mt-1 transition-colors">{l.label}</a>)}</div>}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-blue-400" /></div>
              <div>
                <h3 className="text-white font-bold mb-3">Business Hours</h3>
                <div className="space-y-1.5 text-sm">
                  {[['Monday – Friday', '8:00 AM – 6:00 PM'], ['Saturday', '9:00 AM – 5:00 PM'], ['Sunday', '10:00 AM – 3:00 PM']].map(([day, hours]) => (
                    <div key={day} className="flex justify-between gap-4"><span className="text-gray-400">{day}</span><span className="text-white font-medium">{hours}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Connect With Us</h3>
            <a href="https://wa.me/254700000000?text=Hi%2C%20I%20am%20interested%20in%20a%20motorcycle" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors mb-4 text-sm">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
            <div className="flex gap-3">
              {[{ icon: Facebook, label: 'Facebook' }, { icon: Instagram, label: 'Instagram' }, { icon: Youtube, label: 'YouTube' }, { icon: Twitter, label: 'Twitter' }].map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500 transition-all"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-zinc-800 h-64">
            <iframe title="Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819755698906!2d36.8083!3d-1.2684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173b1f3acf7d%3A0x1dd81f6562218ff6!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-2xl font-black text-white mb-6">Send a Message</h2>
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-emerald-400 text-3xl">&#10003;</span></div>
                <h3 className="text-white font-bold text-xl mb-2">Message Received!</h3>
                <p className="text-gray-400">We'll respond to your inquiry within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Full Name *</label>
                    <input type="text" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="John Doe"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Phone *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 700 000 000"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about the bike you're looking for or any questions you have..."
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 text-sm rounded-xl focus:outline-none focus:border-blue-500 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
