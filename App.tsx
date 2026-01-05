
import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  MapPin,
  Facebook
} from 'lucide-react';
import { ChatMessage, DiagnosticLog, DiagnosticCategory } from './types';
import { geminiService } from './services/geminiService';
import Header from './components/Header';
import ChatBox from './components/ChatBox';
import DiagnosticTool from './components/DiagnosticTool';
import FileUploader from './components/FileUploader';
import PriceComparison from './components/PriceComparison';
import ServiceCenters from './components/ServiceCenters';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'diagnostic' | 'files' | 'pricing' | 'locations'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "မင်္ဂလာပါ။ TechCore AI v2.6 (2026 Premiere) မှ ကြိုဆိုပါတယ်။ ကျွန်ုပ်တို့၏ Technology knowledge, Hardware prices နှင့် Tech locations များကို update ပြုလုပ်ထားပြီးဖြစ်ပါတယ်။ Laptop, PC, Phone hardware ပြဿနာများနှင့် 2026 ထွက် model သစ်များအကြောင်းကို စုံစမ်းမေးမြန်းနိုင်ပါတယ်ခင်ဗျ။",
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [marketSearchLoading, setMarketSearchLoading] = useState(false);
  const [dynamicMarketData, setDynamicMarketData] = useState<any[]>([]);
  const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticLog[]>([]);

  const handleSendMessage = async (text: string, image?: string) => {
    const userMsg: ChatMessage = { 
      role: 'user', 
      text: text || '', 
      image,
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages.slice(-10);
      const result = await geminiService.chat(text, history, image);
      
      const modelMsg: ChatMessage = {
        role: 'model',
        text: result?.text || "No response received.",
        timestamp: Date.now(),
        sources: result?.sources
      };
      setMessages(prev => [...prev, modelMsg]);

      if (text?.toLowerCase().includes('diagnostic') || image) {
        const safeText = text || '';
        const safeResultText = result?.text || '';
        
        // Extraction logic for Silicon Health Report
        const extractField = (label: string) => {
          const regex = new RegExp(`\\[${label}\\]:?\\s*(.*?)(?=\\n\\[|$)`, 'is');
          const match = safeResultText.match(regex);
          return match ? match[1].trim() : '';
        };

        const complexityMatch = extractField('Complexity').match(/\d+/);
        const complexity = complexityMatch ? parseInt(complexityMatch[0]) : 5;

        const newLog: DiagnosticLog = {
          id: Math.random().toString(36).substr(2, 9),
          issue: extractField('Issue Detected') || (safeText.includes('Category:') ? safeText.split('.').pop()?.trim() : safeText.substring(0, 50)),
          repairPath: extractField('Repair Path') || "Analyzing repair nodes...",
          complexity: complexity,
          solution2026: extractField('2026 Solution') || "Generating future-proof fix...",
          category: safeText.includes('Category:') ? (safeText.match(/Category: ([^.]+)/)?.[1] as DiagnosticCategory || DiagnosticCategory.SYSTEM_OS) : DiagnosticCategory.SYSTEM_OS,
          date: Date.now(),
          image: image,
          rawResponse: safeResultText
        };
        setDiagnosticHistory(prev => [newLog, ...prev].slice(0, 20));
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Error communicating with diagnostic engine. Please check your network connection.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGlobalSearch = async (query: string) => {
    setActiveTab('pricing');
    setMarketSearchLoading(true);
    try {
      const results = await geminiService.searchMarketPrices(query);
      setDynamicMarketData(results);
    } catch (err) {
      console.error(err);
    } finally {
      setMarketSearchLoading(false);
    }
  };

  const handleDiagnose = (text: string, image?: string) => {
    setActiveTab('chat');
    handleSendMessage(text, image);
  };

  const handleCopyLogToChat = (log: DiagnosticLog) => {
    const summary = `Re-analyze Silicon Report ID: ${log.id}\nIssue: ${log.issue}\nRepair Path: ${log.repairPath}\nRequested follow-up analysis on this hardware state.`;
    setActiveTab('chat');
    handleSendMessage(summary, log.image);
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden text-black">
      <nav className="w-16 md:w-52 bg-white/10 border-r border-black/5 flex flex-col transition-all duration-300 backdrop-blur-xl z-20">
        <div className="p-4 mb-6 flex items-center gap-3 border-b border-black/5">
          <div className="bg-black p-2 rounded-lg shadow-xl flex-shrink-0">
            <Terminal className="text-white w-5 h-5" />
          </div>
          <span className="hidden md:inline font-black text-lg tracking-tighter text-black uppercase select-none">TECHCORE</span>
        </div>

        <div className="flex-1 px-3 space-y-4">
          <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all relative group ${activeTab === 'chat' ? 'bg-black/10 text-black' : 'text-black/60 hover:bg-black/5'}`}>
            <MessageSquare className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline font-black text-[12px] uppercase tracking-wider">Assistant</span>
          </button>
          
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all relative group ${activeTab === 'pricing' ? 'bg-black/10 text-black' : 'text-black/60 hover:bg-black/5'}`}>
            <BarChart3 className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline font-black text-[12px] uppercase tracking-wider">Market</span>
          </button>

          <button onClick={() => setActiveTab('diagnostic')} className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all relative group ${activeTab === 'diagnostic' ? 'bg-black/10 text-black' : 'text-black/60 hover:bg-black/5'}`}>
            <Cpu className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline font-black text-[12px] uppercase tracking-wider">Hardware</span>
          </button>

          <button onClick={() => setActiveTab('locations')} className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all relative group ${activeTab === 'locations' ? 'bg-black/10 text-black' : 'text-black/60 hover:bg-black/5'}`}>
            <MapPin className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline font-black text-[12px] uppercase tracking-wider">Locations</span>
          </button>

          <button onClick={() => setActiveTab('files')} className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all relative group ${activeTab === 'files' ? 'bg-black/10 text-black' : 'text-black/60 hover:bg-black/5'}`}>
            <FileText className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline font-black text-[12px] uppercase tracking-wider">Analyzer</span>
          </button>

          <a 
            href="https://www.facebook.com/techcore.mm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center gap-4 p-3.5 rounded-xl transition-all text-[#1877F2] hover:bg-[#1877F2]/10 mt-10 border border-[#1877F2]/20"
          >
            <Facebook className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline font-black text-[12px] uppercase tracking-wider">Facebook Page</span>
          </a>
        </div>

        <div className="p-4 border-t border-black/5">
          <div className="hidden md:block space-y-1">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <p className="text-[11px] text-black font-black uppercase tracking-tight">SECURE LINK</p>
             </div>
             <p className="text-[10px] text-black/50 font-black uppercase">v2.6 • 1.1.2026</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
        <Header activeTab={activeTab} onSearch={handleGlobalSearch} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {activeTab === 'chat' && <ChatBox messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />}
            {activeTab === 'pricing' && <PriceComparison isLoading={marketSearchLoading} dynamicResults={dynamicMarketData} />}
            {activeTab === 'diagnostic' && <DiagnosticTool onDiagnose={handleDiagnose} history={diagnosticHistory} onCopyLog={handleCopyLogToChat} />}
            {activeTab === 'files' && <FileUploader onAnalyze={handleSendMessage} />}
            {activeTab === 'locations' && <ServiceCenters />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
