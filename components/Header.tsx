
import React, { useState } from 'react';
import { Search, Bell, User, Facebook } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const titles: Record<string, string> = {
    chat: 'AI Assistant',
    pricing: 'Market Data',
    diagnostic: 'Hardware Scan',
    files: 'File Analyzer',
    locations: 'Service Centers'
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="h-12 border-b border-black/5 flex items-center justify-between px-6 bg-white/10 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-black text-black uppercase tracking-[0.2em]">{titles[activeTab] || 'TechCore'}</h1>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="relative w-full max-w-[220px]">
          <div className="flex items-center bg-black/5 rounded-lg px-3 py-1.5 border border-black/5 focus-within:border-black/20 transition-all">
            <Search className="w-3.5 h-3.5 text-black/40 mr-2 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Crawl market..." 
              className="bg-transparent border-none text-xs text-black placeholder-black/30 focus:outline-none w-full font-black uppercase"
            />
          </div>
        </div>

        <a 
          href="https://www.facebook.com/techcore.mm" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1.5 text-[#1877F2] hover:bg-[#1877F2]/10 rounded-full transition-all"
          title="Visit our Facebook Page"
        >
          <Facebook className="w-4 h-4" />
        </a>

        <button className="relative p-1.5 text-black/60 hover:text-black transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-2 pl-3 border-l border-black/5">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center border border-white/20 shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
