/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MobileSimulator from './components/MobileSimulator';
import CodeViewer from './components/CodeViewer';
import MobileTestGuide from './components/MobileTestGuide';
import { Smartphone, Code, LayoutGrid, Copy, Check, QrCode } from 'lucide-react';
import { EXPO_APP_JS } from './expoCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'split'>('split');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const handleQuickCopy = async () => {
    try {
      await navigator.clipboard.writeText(EXPO_APP_JS);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen text-[var(--bs-text)] flex flex-col relative overflow-x-hidden bs-shell-bg selection:bg-[rgba(30,200,165,0.35)] selection:text-white">
      {/* Soft atmosphere layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-18%] left-[-8%] w-[42vw] h-[42vw] rounded-full bg-[rgba(30,200,165,0.07)] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-12%] w-[48vw] h-[48vw] rounded-full bg-[rgba(56,120,220,0.06)] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bs-glass border-b border-[var(--bs-border)] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[linear-gradient(145deg,#1ec8a5_0%,#12967a_100%)] flex items-center justify-center text-white shadow-[0_8px_24px_-8px_rgba(30,200,165,0.55)] font-extrabold text-sm bs-display shrink-0">
            BS
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-white tracking-tight bs-display">Bill Splitter</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[var(--bs-accent-soft)] text-[var(--bs-accent)] border border-[var(--bs-accent-border)] rounded-md">
                React Native Expo
              </span>
            </div>
            <p className="text-xs text-[var(--bs-text-muted)] hidden sm:block truncate">
              Receipt preview, payment QR, and 1-tap sharing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            id="btn-open-mobile-modal"
            onClick={() => setIsTestModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] text-[var(--bs-accent)] hover:bg-[rgba(30,200,165,0.22)] transition bs-press"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test on Mobile</span>
          </button>

          <div className="bg-white/[0.04] p-1 rounded-xl border border-[var(--bs-border)] flex items-center gap-0.5 text-xs">
            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition bs-nav-pill ${
                activeTab === 'simulator'
                  ? 'bg-[var(--bs-accent)] text-[#04140f] shadow-[0_4px_16px_-4px_var(--bs-accent-glow)]'
                  : 'text-[var(--bs-text-muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simulator</span>
            </button>
            <button
              id="tab-split"
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition bs-nav-pill ${
                activeTab === 'split'
                  ? 'bg-[var(--bs-accent)] text-[#04140f] shadow-[0_4px_16px_-4px_var(--bs-accent-glow)]'
                  : 'text-[var(--bs-text-muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Side-by-Side</span>
            </button>
            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition bs-nav-pill ${
                activeTab === 'code'
                  ? 'bg-[var(--bs-accent)] text-[#04140f] shadow-[0_4px_16px_-4px_var(--bs-accent-glow)]'
                  : 'text-[var(--bs-text-muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden md:inline">App.js Code</span>
            </button>
          </div>

          <button
            id="btn-nav-copy-code"
            onClick={handleQuickCopy}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition bs-press ${
              copiedCode
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white text-[#0a0d12] hover:bg-slate-100'
            }`}
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied App.js!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy App.js</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {activeTab === 'simulator' && (
          <div className="flex flex-col items-center justify-center py-4 bs-animate-in">
            <div className="text-center mb-7 max-w-md">
              <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--bs-accent)] block mb-2">
                Interactive Device Preview
              </span>
              <h2 className="text-3xl font-bold text-white bs-display">Live Mobile Simulator</h2>
              <p className="text-sm text-[var(--bs-text-muted)] mt-2 leading-relaxed">
                Split calculations, payment QR, auto-saved accounts, and clipboard share — same logic, refined chrome.
              </p>
            </div>
            <MobileSimulator />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="max-w-4xl mx-auto py-2 bs-animate-in">
            <CodeViewer />
          </div>
        )}

        {activeTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bs-animate-in">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 px-2">
                <span className="text-[11px] font-bold text-[var(--bs-text-muted)] uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--bs-accent)]" />
                  Live Mobile UI
                </span>
                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="text-[11px] text-[var(--bs-accent)] hover:text-[#4adebf] font-semibold flex items-center gap-1 transition"
                >
                  <QrCode className="w-3 h-3" />
                  Scan to Open on Phone
                </button>
              </div>
              <MobileSimulator />
            </div>

            <div className="lg:col-span-7">
              <div className="w-full flex items-center justify-between mb-3 px-2">
                <span className="text-[11px] font-bold text-[var(--bs-text-muted)] uppercase tracking-[0.12em] flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[var(--bs-accent)]" />
                  React Native (Expo) Source
                </span>
                <span className="text-[11px] text-[var(--bs-text-dim)]">
                  Ready to paste into `App.js`
                </span>
              </div>
              <CodeViewer />
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="btn-floating-mobile-qr"
          onClick={() => setIsTestModalOpen(true)}
          className="group flex items-center gap-2.5 bg-[var(--bs-accent)] hover:brightness-110 text-[#04140f] pl-3.5 pr-4 py-3 rounded-2xl shadow-[0_12px_32px_-8px_rgba(30,200,165,0.55)] border border-white/10 transition-all duration-200 bs-press"
        >
          <div className="w-6 h-6 rounded-lg bg-black/15 flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold leading-tight">Scan on Mobile</span>
            <span className="block text-[10px] text-[#04140f]/70 font-medium">Camera QR Preview</span>
          </div>
        </button>
      </div>

      <MobileTestGuide
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}
