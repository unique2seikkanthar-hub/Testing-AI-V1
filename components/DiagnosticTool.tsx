
import React, { useState, useRef } from 'react';
import { DiagnosticCategory, DiagnosticLog } from '../types';
import { 
  Zap, 
  Monitor, 
  Apple, 
  ShieldCheck, 
  Image as ImageIcon, 
  X, 
  History, 
  Maximize2, 
  Layout, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  MessageSquareShare,
  FileSearch,
  Search
} from 'lucide-react';

const CATEGORIES = [
  { id: DiagnosticCategory.SOFTWARE_SECURITY, icon: ShieldCheck, color: 'text-rose-600', desc: 'Secure encryption.' },
  { id: DiagnosticCategory.OS_WINDOWS, icon: Monitor, color: 'text-blue-600', desc: 'Kernel support.' },
  { id: DiagnosticCategory.OS_MACOS, icon: Apple, color: 'text-black', desc: 'Logic board.' },
  { id: DiagnosticCategory.POWER, icon: Zap, color: 'text-amber-600', desc: 'Voltage check.' },
  { id: DiagnosticCategory.GPU, icon: Layout, color: 'text-emerald-600', desc: 'Blackwell/RTX core.' },
];

interface DiagnosticToolProps {
  onDiagnose: (text: string, image?: string) => void;
  onCopyLog: (log: DiagnosticLog) => void;
  history?: DiagnosticLog[];
}

const DiagnosticTool: React.FC<DiagnosticToolProps> = ({ onDiagnose, onCopyLog, history = [] }) => {
  const [selected, setSelected] = useState<DiagnosticCategory | null>(null);
  const [details, setDetails] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnoseClick = () => {
    if (!selected) return;
    const prompt = `Hardware Diagnostic Request: Category: ${selected}. Symptoms: ${details || 'None'}.`;
    onDiagnose(prompt, image || undefined);
    setDetails(''); setImage(null); setSelected(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredHistory = history.filter(log => 
    log.issue.toLowerCase().includes(historySearch.toLowerCase()) ||
    log.category.toLowerCase().includes(historySearch.toLowerCase()) ||
    log.id.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-500 bg-transparent flex flex-col gap-16">
      <div className="max-w-3xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-black text-glow uppercase tracking-tighter">Diagnostic Center</h2>
          <p className="text-black/20 font-black text-[10px] uppercase tracking-[0.3em]">Initialize Hardware Subsystem Scan</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`p-8 rounded-[2rem] border transition-all text-left group ${
                selected === cat.id ? 'border-black bg-black/5' : 'border-black/10 hover:border-black/30 bg-transparent'
              }`}
            >
              <cat.icon className={`w-6 h-6 mb-4 ${cat.color}`} />
              <h3 className="font-black text-black text-sm tracking-tight uppercase mb-1">{cat.id}</h3>
              <p className="text-[10px] text-black/30 font-black uppercase tracking-widest">{cat.desc}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Symptom Log</label>
               <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Detail the failure symptoms..."
                className="w-full bg-black/5 border border-black/10 rounded-2xl p-6 text-black text-sm focus:outline-none focus:border-black/30 min-h-[160px] transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Silicon Evidence</label>
              <div className="flex gap-4">
                {image ? (
                  <div className="relative group">
                    <img src={image} className="w-32 h-32 object-cover rounded-3xl border border-black/20 shadow-md" alt="Hardware" />
                    <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-black text-white p-1.5 rounded-full shadow-lg"><X className="w-3.5 h-3.5" /></button>
                    <button 
                      onClick={() => setViewingImage(image)}
                      className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 border border-black/10 border-dashed bg-transparent rounded-[2rem] p-10 flex flex-col items-center gap-3 hover:border-black/30 transition-all text-black/20 hover:text-black">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Attach Visuals</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <button 
              onClick={handleDiagnoseClick}
              className="w-full bg-black text-white font-black py-6 rounded-[2rem] uppercase tracking-[0.3em] text-[11px] hover:bg-zinc-800 transition-all shadow-2xl"
            >
              Run Logic Scan
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 pb-4">
          <div className="flex items-center gap-4">
            <History className="w-5 h-5 text-black/40" />
            <h3 className="text-sm font-black text-black uppercase tracking-widest">Historical Logic Logs</h3>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
            <input 
              type="text" 
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Filter logs..."
              className="w-full bg-black/5 border border-black/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black/30 transition-all"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 border border-black/5 rounded-[2rem] bg-black/[0.02]">
               <Activity className="w-8 h-8 text-black/10 mx-auto mb-4" />
               <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em]">
                 {historySearch ? 'No matches found in archive' : 'No Silicon History Available'}
               </p>
            </div>
          ) : (
            filteredHistory.map((log) => {
              const isExpanded = expandedId === log.id;
              return (
                <div key={log.id} className={`border border-black/5 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-black/[0.02] shadow-xl border-black/10' : 'bg-transparent hover:border-black/10'}`}>
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer group"
                    onClick={() => toggleExpand(log.id)}
                  >
                    <div className="flex items-center gap-6 min-w-0">
                      <div className="relative group/img">
                        {log.image ? (
                          <img src={log.image} alt="Log" className="w-16 h-16 rounded-2xl object-cover border border-black/10 group-hover:border-black/30 transition-all" />
                        ) : (
                          <div className="w-16 h-16 border border-black/10 rounded-2xl flex items-center justify-center text-black/20"><ShieldCheck className="w-8 h-8" /></div>
                        )}
                        {log.image && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setViewingImage(log.image!); }}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center rounded-2xl transition-opacity text-white"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">ID: {log.id}</span>
                          <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.1em]">{new Date(log.date).toLocaleDateString()}</span>
                          <span className="text-[8px] font-black text-black/20 uppercase tracking-tighter">[{log.category}]</span>
                        </div>
                        <h4 className="text-sm font-black text-black uppercase tracking-tight truncate max-w-md">{log.issue}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <button className="text-[9px] font-black uppercase text-black/30 group-hover:text-black transition-colors flex items-center gap-2">
                         {isExpanded ? 'Minimize' : 'Silicon Health Report'}
                         {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-8 pb-10 pt-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-black/10 pt-8">
                        
                        <div className="space-y-6 md:col-span-2">
                          <div>
                            <label className="text-[9px] font-black text-black/30 uppercase tracking-widest block mb-3 flex items-center gap-2">
                              <FileSearch className="w-3 h-3" /> [Recovery Strategy]
                            </label>
                            <div className="p-4 bg-white border border-black/5 rounded-2xl font-mono text-[11px] font-black uppercase leading-relaxed text-black/80 whitespace-pre-wrap">
                              {log.repairPath}
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-black text-black/30 uppercase tracking-widest block mb-3 flex items-center gap-2">
                              <Activity className="w-3 h-3" /> [2026 Deployment Fix]
                            </label>
                            <div className="p-4 bg-white border border-black/5 rounded-2xl text-[12px] font-black uppercase leading-relaxed text-black whitespace-pre-wrap">
                              {log.solution2026}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                            <label className="text-[9px] font-black text-black/30 uppercase tracking-widest block mb-3">Silicon Strain Level</label>
                            <div className="space-y-2">
                               <div className="flex justify-between text-[10px] font-black text-black">
                                 <span>{log.complexity}/10</span>
                                 <span className="uppercase tracking-tighter">{log.complexity > 7 ? 'CRITICAL' : 'OPTIMAL'}</span>
                               </div>
                               <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full transition-all duration-1000 ${log.complexity > 7 ? 'bg-rose-600' : 'bg-black'}`}
                                    style={{ width: `${log.complexity * 10}%` }}
                                  />
                               </div>
                            </div>
                           </div>

                           <div className="p-4 bg-black text-white rounded-2xl space-y-3 shadow-2xl">
                             <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">System Metadata</p>
                             <div className="flex justify-between items-center text-[9px] font-black uppercase">
                               <span className="opacity-60">Category</span>
                               <span className="tracking-tighter">{log.category}</span>
                             </div>
                             <div className="flex justify-between items-center text-[9px] font-black uppercase">
                               <span className="opacity-60">Timestamp</span>
                               <span className="tracking-tighter">{new Date(log.date).toLocaleTimeString()}</span>
                             </div>
                             <div className="pt-4 flex flex-col gap-2">
                               <button 
                                onClick={() => onCopyLog(log)}
                                className="w-full bg-white text-black py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95"
                               >
                                <MessageSquareShare className="w-3 h-3" /> Copy Log to Chat
                               </button>
                               <button 
                                onClick={() => {}} 
                                className="w-full bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                               >
                                EXPORT REPORT (PDF)
                               </button>
                             </div>
                           </div>
                        </div>
                        
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {viewingImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-3xl p-6 cursor-zoom-out" 
          onClick={() => setViewingImage(null)}
        >
          <div className="relative animate-in zoom-in-95 duration-300 max-w-5xl w-full h-full flex items-center justify-center">
             <img src={viewingImage} className="max-w-full max-h-full rounded-3xl object-contain shadow-2xl border border-black/10" alt="Hardware Evidence" />
             <button className="absolute top-4 right-4 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticTool;
