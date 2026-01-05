
import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

const YANGON_BRANCHES = [
  { name: 'Yuzana Plaza Branch', location: 'Tamwe Township, Yangon' },
  { name: 'City Mall (St. John) Branch', location: 'Lanmadaw Township, Yangon' },
  { name: 'Seikkantha Branch (Main)', location: 'Kyauktada Township, Yangon' },
  { name: 'Junction City Branch', location: 'Pabedan Township, Yangon' },
  { name: 'Gamone Pwint (Sanpya) Branch', location: 'Thingangyun Township, Yangon' },
  { name: 'Hledan Center Branch', location: 'Kamayut Township, Yangon' },
  { name: 'Ocean North Point Branch', location: 'Mayangone Township, Yangon' },
  { name: 'Sule Square Branch', location: 'Kyauktada Township, Yangon' },
];

const MANDALAY_BRANCHES = [
  { name: '78th Street Branch', location: '78th St, Between 32nd & 33rd St, Mandalay' },
];

const ServiceCenters: React.FC = () => {
  const getMapsUrl = (name: string, location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + location)}`;
  };

  return (
    <div className="p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-transparent">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-black text-glow uppercase tracking-tighter">Unique IT Service Network</h2>
          <p className="text-black/60 font-black uppercase text-xs tracking-[0.2em] bg-white/50 px-4 py-1.5 rounded-full w-fit mx-auto">Visit our physical branches for motherboard diagnostics.</p>
        </div>

        {/* Yangon Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-black/10 pb-2">
            <MapPin className="text-black w-6 h-6" />
            <h3 className="text-xl font-black text-black uppercase tracking-widest">Yangon Hubs (8)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {YANGON_BRANCHES.map((branch, i) => (
              <div key={i} className="bg-white/90 border border-black/5 rounded-3xl p-5 hover:border-black/20 hover:shadow-2xl transition-all group hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-black p-2 rounded-xl text-white shadow-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-black/5 text-black px-2 py-1 rounded-lg font-black uppercase tracking-widest">Branch #{i + 1}</span>
                </div>
                <h4 className="text-black font-black mb-1 transition-colors uppercase text-sm tracking-tight leading-none">{branch.name}</h4>
                <p className="text-[10px] text-black/40 flex items-start gap-2 mb-6 font-black uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {branch.location}
                </p>
                <div className="flex gap-2">
                  <a href="tel:+959" className="flex-1 bg-black/5 hover:bg-black/10 text-black text-[10px] py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors font-black uppercase tracking-widest">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <a 
                    href={getMapsUrl(branch.name, branch.location)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 bg-black text-white text-[10px] py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors font-black uppercase tracking-widest hover:bg-zinc-800 shadow-md"
                  >
                    <ExternalLink className="w-3 h-3" /> Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mandalay Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-black/10 pb-2">
            <MapPin className="text-black w-6 h-6" />
            <h3 className="text-xl font-black text-black uppercase tracking-widest">Mandalay Division (1)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANDALAY_BRANCHES.map((branch, i) => (
              <div key={i} className="bg-white/90 border border-black/5 rounded-3xl p-5 hover:border-black/20 hover:shadow-2xl transition-all group hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-black p-2 rounded-xl text-white shadow-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-black/5 text-black px-2 py-1 rounded-lg font-black uppercase tracking-widest">Upper Myanmar</span>
                </div>
                <h4 className="text-black font-black mb-1 transition-colors uppercase text-sm tracking-tight leading-none">{branch.name}</h4>
                <p className="text-[10px] text-black/40 flex items-start gap-2 mb-6 font-black uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {branch.location}
                </p>
                <div className="flex gap-2">
                  <a href="tel:+959" className="flex-1 bg-black/5 hover:bg-black/10 text-black text-[10px] py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors font-black uppercase tracking-widest">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <a 
                    href={getMapsUrl(branch.name, branch.location)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 bg-black text-white text-[10px] py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors font-black uppercase tracking-widest hover:bg-zinc-800 shadow-md"
                  >
                    <ExternalLink className="w-3 h-3" /> Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-white/60 backdrop-blur-xl border border-black/10 p-8 rounded-[40px] flex flex-col md:flex-row items-center gap-8 justify-between shadow-2xl">
          <div className="space-y-2">
            <h4 className="text-lg font-black uppercase text-black tracking-tighter">Priority Support Token</h4>
            <p className="text-[10px] text-black/60 font-black uppercase tracking-widest leading-loose">Present this AI diagnostic log at any branch for expedited motherboard silicon recovery.</p>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-black font-black uppercase tracking-widest shrink-0">
            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full"><Clock className="w-3.5 h-3.5" /> 9AM - 8PM</div>
            <div className="opacity-20 hidden md:block text-2xl">|</div>
            <div>MON - SUN</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenters;