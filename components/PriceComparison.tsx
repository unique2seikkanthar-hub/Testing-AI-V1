
import React, { useState } from 'react';
import { MapPin, Cpu, HardDrive, Layout, Zap, Loader2 } from 'lucide-react';

interface ComponentPrice {
  id?: string;
  name: string;
  category: string;
  specs: string;
  prices: { seikkantha: number; yuzana: number; mandalay: number; };
}

const STATIC_MARKET_DATA: ComponentPrice[] = [
  { id: 'c1', name: 'Intel Ultra 9 385K', category: 'CPU', specs: '24 Cores, 5.7GHz', prices: { seikkantha: 2450000, yuzana: 2520000, mandalay: 2580000 } },
  { id: 'g1', name: 'NVIDIA RTX 5090 FE', category: 'GPU', specs: '32GB G7, Blackwell', prices: { seikkantha: 6850000, yuzana: 6980000, mandalay: 7150000 } },
  { id: 'r1', name: 'Trident Z6 DDR6', category: 'RAM', specs: '32GB, 8400MT/s', prices: { seikkantha: 950000, yuzana: 985000, mandalay: 1020000 } },
  { id: 's1', name: 'Samsung 990 Pro G6', category: 'SSD', specs: '2TB, 24kMB/s', prices: { seikkantha: 1250000, yuzana: 1290000, mandalay: 1340000 } }
];

interface PriceComparisonProps {
  isLoading?: boolean;
  dynamicResults?: ComponentPrice[];
}

const PriceComparison: React.FC<PriceComparisonProps> = ({ isLoading, dynamicResults }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  
  const baseData = (dynamicResults && dynamicResults.length > 0) ? dynamicResults : STATIC_MARKET_DATA;
  const filteredData = activeCategory === 'ALL' ? baseData : baseData.filter(item => (item.category || '').toUpperCase().includes(activeCategory));
  
  const formatPrice = (num: number) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-MM').format(num) + ' Ks';
  };

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-500 bg-transparent">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white text-glow uppercase tracking-tighter">Market Radar</h2>
            <div className="flex items-center gap-4">
              <p className="text-white/20 font-black text-[10px] uppercase tracking-widest">
                {dynamicResults && dynamicResults.length > 0 ? 'AI Live Stream' : 'Index: Jan 2026'}
              </p>
              {isLoading && <Loader2 className="w-3 h-3 text-white animate-spin" />}
            </div>
          </div>
          
          <div className="flex gap-4">
            {['ALL', 'CPU', 'GPU', 'RAM', 'SSD'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-black transition-all uppercase tracking-widest pb-1 border-b-2 ${
                  activeCategory === cat ? 'text-white border-white' : 'text-white/20 border-transparent hover:text-white/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {filteredData.map((item, idx) => (
            <div key={item.id || idx} className="flex flex-col md:flex-row gap-10 items-start md:items-center py-4 group">
              <div className="flex-1 flex items-center gap-6 min-w-0">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-white/40 group-hover:text-white group-hover:border-white/30 transition-all">
                  {(item.category || '').toUpperCase().includes('CPU') && <Cpu className="w-6 h-6" />}
                  {(item.category || '').toUpperCase().includes('GPU') && <Layout className="w-6 h-6" />}
                  {(item.category || '').toUpperCase().includes('SSD') && <HardDrive className="w-6 h-6" />}
                  {(item.category || '').toUpperCase().includes('RAM') && <Zap className="w-6 h-6" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{item.name}</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{item.specs}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-10 md:w-3/5 border-l border-white/10 pl-10">
                {[
                  { hub: 'Seikkantha', price: item.prices?.seikkantha },
                  { hub: 'Yuzana', price: item.prices?.yuzana },
                  { hub: 'Mandalay', price: item.prices?.mandalay }
                ].map((loc, i) => (
                  <div key={i}>
                    <div className="text-[9px] font-black text-white/20 uppercase mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {loc.hub}</div>
                    <div className="text-[13px] font-black text-white tracking-tight">{formatPrice(loc.price || 0)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
