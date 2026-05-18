import { Shield, Award, Users, Heart, Target, Zap } from 'lucide-react';

const team = [
  { name: 'David Kimani', role: 'Founder & CEO', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', bio: 'A passionate motorcyclist with 15 years of industry experience, David founded Nairobi Powerbikes to bring world-class bikes to Kenyan riders.' },
  { name: 'Grace Njeri', role: 'Head of Sales', img: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg', bio: 'Grace leads our sales team with expertise in premium automotive brands and a dedication to matching riders with their perfect machine.' },
  { name: 'Mike Otieno', role: 'Chief Mechanic', img: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg', bio: 'With certifications from Yamaha and Honda, Mike ensures every bike that leaves our showroom is in peak performing condition.' },
  { name: 'Amina Hassan', role: 'Customer Relations', img: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg', bio: "Amina is the heartbeat of our customer experience team, ensuring every rider's journey from inquiry to purchase is seamless." },
];

const values = [
  { icon: Shield, title: 'Integrity', desc: 'Transparent pricing, honest assessments, and clean documentation on every transaction.' },
  { icon: Award, title: 'Excellence', desc: 'We only stock bikes that meet our rigorous quality standards and verification process.' },
  { icon: Users, title: 'Community', desc: 'We believe in building a community of passionate riders across Kenya and East Africa.' },
  { icon: Heart, title: 'Passion', desc: "Motorcycles are more than a product to us — they're a way of life we share with every customer." },
  { icon: Target, title: 'Customer First', desc: 'Your riding dreams guide every decision we make, from inventory selection to after-sales care.' },
  { icon: Zap, title: 'Innovation', desc: 'We constantly evolve our services to bring the latest models and technology to Kenyan riders.' },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen pt-24 pb-20">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-4">Our Story</p>
          <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tight text-white mb-6 leading-tight">About Nairobi<br />Powerbikes</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">Born from a passion for riding, built on a promise of quality. We are Kenya's premier destination for premium motorcycles.</p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-3">Our Journey</p>
            <h2 className="text-4xl font-display font-black tracking-tight text-white mb-6">Where It All Began</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>Nairobi Powerbikes was founded in 2017 by David Kimani, a lifelong motorcycle enthusiast who saw a gap in the Kenyan market for genuinely premium, properly documented imported motorcycles.</p>
              <p>Frustrated by the lack of quality assurance and transparency in the local market, David set out to create a dealership that treated every motorcycle purchase with the same rigor and professionalism as luxury automotive brands worldwide.</p>
              <p>Starting with just three bikes in a small showroom in Westlands, we have grown into Kenya's most trusted premium motorcycle dealership, having sold over 500 bikes to riders across all 47 counties.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.pexels.com/photos/1005413/pexels-photo-1005413.jpeg" alt="Showroom" className="rounded-2xl object-cover h-48 w-full" />
            <img src="https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg" alt="Team" className="rounded-2xl object-cover h-48 w-full mt-8" />
            <img src="https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg" alt="Bikes" className="rounded-2xl object-cover h-48 w-full -mt-4" />
            <img src="https://images.pexels.com/photos/258092/pexels-photo-258092.jpeg" alt="Service" className="rounded-2xl object-cover h-48 w-full mt-4" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#111] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="card-premium border border-white/10 rounded-2xl p-8">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-5"><Target className="w-6 h-6 text-red-400" /></div>
            <h3 className="text-2xl font-display font-black tracking-tight text-white mb-3">Our Mission</h3>
            <p className="text-gray-400 leading-relaxed">To democratize access to premium motorcycles in Kenya by providing a trustworthy, transparent, and professional platform where every rider can find their perfect machine.</p>
          </div>
          <div className="card-premium border border-white/10 rounded-2xl p-8">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-5"><Zap className="w-6 h-6 text-red-400" /></div>
            <h3 className="text-2xl font-display font-black tracking-tight text-white mb-3">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">To be East Africa's leading premium motorcycle dealership, recognized for our uncompromising quality standards, customer-first culture, and contribution to building a vibrant riding community.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">What Drives Us</p>
          <h2 className="text-4xl font-display font-black tracking-tight text-white">Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-premium border border-white/5 hover:border-red-500/40 rounded-2xl p-6 group transition-all hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors"><Icon className="w-6 h-6 text-red-300" /></div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-[#111] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-red-400 font-display font-bold text-xs tracking-[0.2em] uppercase mb-2">The People Behind</p>
            <h2 className="text-4xl font-display font-black tracking-tight text-white">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="card-premium overflow-hidden border border-white/5 rounded-2xl group hover:border-red-500/40 transition-all hover:-translate-y-1 duration-300">
                <div className="aspect-square overflow-hidden">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover rounded-none group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg mb-0.5">{member.name}</h3>
                  <p className="text-red-400 font-display font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
