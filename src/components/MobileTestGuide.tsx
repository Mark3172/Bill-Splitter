import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, ExternalLink, Copy, Check, Terminal, Play, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { EXPO_INSTALL_COMMAND } from '../expoCode';

interface MobileTestGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileTestGuide({ isOpen, onClose }: MobileTestGuideProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'instant-web' | 'expo-go'>('instant-web');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Generate QR code URL using standard public QR API
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl || 'https://ai.studio'
  )}&bgcolor=1E1E1E&color=3B82F6&margin=8`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Test on Your Mobile Device</h2>
              <p className="text-xs text-white/50">Choose between Instant Web or Native Expo Go</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-2 my-5 p-1 bg-white/5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveSubTab('instant-web')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeSubTab === 'instant-web'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Method 1: Scan & Test on Web (Instant)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('expo-go')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeSubTab === 'expo-go'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Method 2: Native Expo Go</span>
          </button>
        </div>

        {/* Tab 1: Instant Web Mobile Test */}
        {activeSubTab === 'instant-web' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-center gap-5">
              {/* QR Code Container */}
              <div className="w-[140px] h-[140px] rounded-2xl overflow-hidden bg-[#1E1E1E] border border-blue-500/40 p-2 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
                <img
                  src={qrApiUrl}
                  alt="Scan to open on mobile"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              {/* Instructions */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Instant Live Testing
                </div>
                <h3 className="text-sm font-bold text-white">Scan with Camera (iPhone / Android)</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Open your phone camera, scan this QR code to load the app directly on your mobile browser. Supports native clipboard sharing, photo QR uploads, and haptics!
                </p>
              </div>
            </div>

            {/* Direct URL Box */}
            <div>
              <label className="text-[11px] font-semibold text-white/50 block mb-1.5">
                Or copy your live URL to open on mobile:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-blue-300 font-mono select-all outline-none"
                />
                <button
                  onClick={copyUrl}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 ${
                    copiedUrl
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Native Expo Go App */}
        {activeSubTab === 'expo-go' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Option A: Quick Snack (No Node.js install)
                </span>
                <a
                  href="https://snack.expo.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  Open Snack <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-white/70">
                1. Open <a href="https://snack.expo.dev" target="_blank" rel="noreferrer" className="text-blue-400 underline">snack.expo.dev</a> on your computer.<br />
                2. Paste the code from <strong className="text-white">App.js</strong>.<br />
                3. Click <strong className="text-white">"Run on device"</strong> and scan the QR code using the <strong className="text-white">Expo Go</strong> app on iOS or Android!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Option B: Run in Local Expo CLI
              </span>
              <div className="bg-black/60 rounded-xl p-3 font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto border border-white/5">
                <p className="text-slate-400"># 1. Create Expo project</p>
                <p className="text-emerald-300">npx create-expo-app BillSplitter</p>
                <p className="text-slate-400 mt-2"># 2. Install required modules</p>
                <p className="text-blue-300">{EXPO_INSTALL_COMMAND}</p>
                <p className="text-slate-400 mt-2"># 3. Replace App.js & start</p>
                <p className="text-yellow-300">npx expo start --tunnel</p>
              </div>
              <p className="text-[11px] text-white/50">
                Scan the terminal QR code with your phone camera (iOS) or Expo Go app (Android).
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-white/40">
            Works with iOS Safari, Android Chrome, & Expo Go
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
