
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Bot, User, Image as ImageIcon, X, Camera, Loader2, ExternalLink, Facebook } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string) => void;
  isTyping: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Helper to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        const isFacebook = part.toLowerCase().includes('facebook.com');
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`inline-flex items-center gap-1 underline break-all transition-colors ${
              isFacebook ? 'text-[#1877F2] hover:text-[#0c5dc7]' : 'text-blue-700 hover:text-blue-900'
            }`}
          >
            {isFacebook && <Facebook className="w-3.5 h-3.5 shrink-0" />}
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachedImage) || isTyping) return;
    onSendMessage(input, attachedImage || undefined);
    setInput('');
    setAttachedImage(null);
  };

  const removeAttachment = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 scroll-smooth"
      >
        {messages.map((msg, idx) => {
          const isModel = msg.role === 'model';
          return (
            <div 
              key={idx} 
              className={`flex gap-6 ${isModel ? '' : 'flex-row-reverse'}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-black/10 ${
                isModel ? 'bg-black text-white' : 'bg-black/10 text-black'
              }`}>
                {isModel ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[85%] space-y-2 ${isModel ? '' : 'text-right'}`}>
                <div className="text-[15px] font-bold leading-relaxed whitespace-pre-wrap text-black text-glow">
                  {msg.image && (
                    <div className="relative mb-4 overflow-hidden rounded-3xl border border-black/10 bg-black/5 backdrop-blur-sm">
                      <img src={msg.image} alt="Hardware visual" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                  )}
                  {renderTextWithLinks(msg.text)}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className={`flex flex-wrap gap-2 mt-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
                    {msg.sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-black border border-black px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        Source {i+1}: {s.title?.substring(0, 15) || 'Web link'}...
                      </a>
                    ))}
                  </div>
                )}

                <div>
                  <span className="text-[9px] text-black/20 font-black uppercase tracking-[0.2em]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex gap-6 animate-in fade-in duration-300">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex gap-1.5 items-center py-2">
              <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-black/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 bg-transparent">
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
          {attachedImage && (
            <div className="absolute bottom-full left-0 mb-4 p-2 bg-white/60 backdrop-blur-3xl border border-black/10 rounded-3xl shadow-2xl">
              <div className="relative">
                <img src={attachedImage} alt="Preview" className="w-36 h-36 object-cover rounded-2xl" />
                <button type="button" onClick={removeAttachment} className="absolute -top-2 -right-2 bg-black text-white p-1.5 rounded-full"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}

          <div className="relative flex items-center bg-black border border-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-white/10 transition-all shadow-2xl">
            <div className="pl-4 flex items-center gap-1">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-zinc-500 hover:text-white transition-colors"><ImageIcon className="w-4 h-4" /></button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Describe technical issue..." 
              className="w-full bg-transparent text-white px-3 py-4 focus:outline-none text-[14px] font-bold placeholder-zinc-600"
            />
            <div className="pr-3">
               <button 
                type="submit"
                disabled={(!input.trim() && !attachedImage) || isTyping}
                className="bg-white text-black px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest disabled:opacity-20 transition-all shadow-lg active:scale-95"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
