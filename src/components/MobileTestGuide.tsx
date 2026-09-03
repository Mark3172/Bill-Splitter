import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, ExternalLink, Copy, Check, Play, X, ShieldCheck } from 'lucide-react';
import { EXPO_INSTALL_COMMAND } from '../expoCode';

interface MobileTestGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileTestGuide({ isOpen, onClose }: MobileTestGuideProps) {
  const DEFAULT_DEV_URL = 'https://ais-dev-nmllknqpayu5qetudpqd2y-658469413803.asia-northeast1.run.app';
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_DEV_URL);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'instant-web' | 'expo-go'>('instant-web');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location?.href && !window.location.href.startsWith('about:')) {
      const resolved = window.location.origin || window.location.href;
      if (resolved && resolved.startsWith('http')) {
        setCurrentUrl(resolved);
      }
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

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=FFFFFF&color=000000&margin=12&qzone=2`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md bs-animate-fade">
      <div className="bg-[#0f131a] border border-[var(--bs-border)] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden bs-animate-in">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[rgba(30,200,165,0.12)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[rgba(56,120,220,0.08)] rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-5 border-b border-[var(--bs-border)] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] flex items-center justify-center text-[var(--bs-accent)]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight bs-display">Test on Your Mobile Device</h2>
              <p className="text-xs text-[var(--bs-text-muted)]">Choose between Instant Web or Native Expo Go</p>
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

        <div className="flex items-center gap-2 my-5 p-1 bg-white/[0.04] rounded-2xl border border-[var(--bs-border)]">
          <button
            onClick={() => setActiveSubTab('instant-web')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeSubTab === 'instant-web'
                ? 'bg-[var(--bs-accent)] text-[#04140f] shadow-md'
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
                ? 'bg-[var(--bs-accent)] text-[#04140f] shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Method 2: Native Expo Go</span>
          </button>
        </div>

        {activeSubTab === 'instant-web' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#171c26] to-[#12161e] border border-[var(--bs-accent-border)] flex flex-col sm:flex-row items-center gap-6">
              <div className="w-[170px] h-[170px] rounded-2xl overflow-hidden bg-white p-2.5 flex items-center justify-center shrink-0 shadow-2xl ring-4 ring-white/10">
                <img
                  src={qrApiUrl}
                  alt="Scan QR code to test on mobile"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] text-[var(--bs-accent)] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Point & Scan with Camera
                </div>
                <h3 className="text-base font-extrabold text-white bs-display">Scan with iPhone / Android Camera</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open your default camera app, point it at this QR code, and tap the yellow link banner to launch the live app directly in Safari or Chrome on your phone.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bs-accent)] hover:brightness-110 text-[#04140f] text-xs font-semibold shadow-md transition bs-press"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={copyUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition bs-press"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--bs-text-muted)] block mb-1.5">
                Live URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--bs-accent)] bs-mono select-all outline-none"
                />
                <button
                  onClick={copyUrl}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition bs-press ${
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

        {activeSubTab === 'expo-go' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-[var(--bs-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--bs-accent)] uppercase tracking-wider">
                  Option A: Quick Snack (No Node.js install)
                </span>
                <a
                  href="https://snack.expo.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#04140f] bg-[var(--bs-accent)] hover:brightness-110 px-3 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  Open Snack <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-white/70">
                1. Open <a href="https://snack.expo.dev" target="_blank" rel="noreferrer" className="text-[var(--bs-accent)] underline">snack.expo.dev</a> on your computer.<br />
                2. Paste the code from <strong className="text-white">App.js</strong>.<br />
                3. Click <strong className="text-white">"Run on device"</strong> and scan the QR code using the <strong className="text-white">Expo Go</strong> app on iOS or Android!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-[var(--bs-border)] space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Option B: Run in Local Expo CLI
              </span>
              <div className="bg-black/60 rounded-xl p-3 bs-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto border border-white/5">
                <p className="text-slate-400"># 1. Create Expo project</p>
                <p className="text-emerald-300">npx create-expo-app BillSplitter</p>
                <p className="text-slate-400 mt-2"># 2. Install required modules</p>
                <p className="text-[var(--bs-accent)]">{EXPO_INSTALL_COMMAND}</p>
                <p className="text-slate-400 mt-2"># 3. Replace App.js & start</p>
                <p className="text-yellow-300">npx expo start --tunnel</p>
              </div>
              <p className="text-[11px] text-white/50">
                Scan the terminal QR code with your phone camera (iOS) or Expo Go app (Android).
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[var(--bs-border)] flex items-center justify-between">
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
