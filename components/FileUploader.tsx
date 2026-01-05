
import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  onAnalyze: (text: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    try {
      const text = await file.text();
      const prompt = `Analyze this IT file (${file.name}):\n\n${text.slice(0, 5000)}`;
      onAnalyze(prompt);
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 md:p-12 flex-1 flex flex-col justify-center animate-in fade-in duration-700 bg-transparent">
      <div className="max-w-3xl mx-auto w-full space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-black text-glow uppercase tracking-tighter">Binary Analyzer</h2>
          <p className="text-black/60 font-black text-xs uppercase tracking-[0.2em]">Upload technical metadata for AI recognition.</p>
        </div>

        <div className={`relative border-4 border-dashed rounded-[40px] p-12 md:p-20 transition-all text-center overflow-hidden ${
          file ? 'border-black bg-white shadow-2xl' : 'border-black/10 hover:border-black/40 bg-white/40 backdrop-blur-sm'
        }`}>
          {!file ? (
            <>
              <input 
                type="file" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-6">
                <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto text-white shadow-2xl rotate-3 hover:rotate-0 transition-transform">
                  <Upload className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-black font-black text-2xl uppercase tracking-tighter">Ingest system logs</p>
                  <p className="text-black/40 text-xs font-black mt-2 uppercase tracking-[0.3em]">.LOG .TXT .DMP .REG</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95">
              <div className="flex items-center justify-center gap-6">
                <div className="p-5 bg-black rounded-3xl text-white shadow-2xl">
                  <FileCode className="w-10 h-10" />
                </div>
                <div className="text-left">
                  <p className="text-black font-black text-xl uppercase tracking-tighter">{file.name}</p>
                  <p className="text-black/40 text-xs font-black uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB READY FOR SCAN</p>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="p-3 text-black/20 hover:text-red-600 transition-colors bg-black/5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={processFile}
                disabled={analyzing}
                className="w-full bg-black hover:bg-zinc-800 disabled:opacity-20 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl uppercase tracking-[0.2em] text-sm active:scale-95"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    DECODING BITSTREAM...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Launch Analyzer
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl flex items-start gap-4 border border-black/5 shadow-sm">
            <AlertCircle className="w-6 h-6 text-black shrink-0 mt-0.5" />
            <div>
              <p className="text-black text-sm font-black uppercase tracking-tight">Encryption Privacy</p>
              <p className="text-[10px] text-black/50 leading-relaxed font-black uppercase tracking-widest mt-1">Logs are processed in transient memory and zero-recorded.</p>
            </div>
          </div>
          <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl flex items-start gap-4 border border-black/5 shadow-sm">
            <FileCode className="w-6 h-6 text-black shrink-0 mt-0.5" />
            <div>
              <p className="text-black text-sm font-black uppercase tracking-tight">Logic Coverage</p>
              <p className="text-[10px] text-black/50 leading-relaxed font-black uppercase tracking-widest mt-1">Full heuristic scan for 2026 firmware and silicon bugs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
