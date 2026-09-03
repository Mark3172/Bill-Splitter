/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MobileSimulator from './components/MobileSimulator';
import CodeViewer from './components/CodeViewer';
import MobileTestGuide from './components/MobileTestGuide';
import { Smartphone, Code, LayoutGrid, Sparkles, Copy, Check, QrCode } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-blue-600 selection:text-white"
         style={{ background: 'radial-gradient(circle at 10% 10%, #171b2d 0%, #050505 100%)' }}>
      
      {/* Background Decorative Ambient Blur Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      {/* Top Frosted Navbar */}
      <header className="sticky top-0 z-50 bg-[#0A0D14]/70 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 font-extrabold text-sm">
            BS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Bill Splitter</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                React Native Expo
              </span>
            </div>
            <p className="text-xs text-white/40 hidden sm:block">
              Utility app with Receipt Preview, payment QR codes, and 1-tap sharing
            </p>
          </div>
        </div>

        {/* View Switcher & Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-open-mobile-modal"
            onClick={() => setIsTestModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white transition shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Test on Mobile</span>
          </button>

          <div className="bg-white/5 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex items-center gap-1 text-xs shadow-inner">
            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simulator</span>
            </button>
            <button
              id="tab-split"
              onClick={() => setActiveTab('split')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'split'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Side-by-Side</span>
            </button>
            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden md:inline">App.js Code</span>
            </button>
          </div>

          <button
            id="btn-nav-copy-code"
            onClick={handleQuickCopy}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 ${
              copiedCode
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white text-black hover:bg-slate-100 shadow-md shadow-white/10'
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

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {activeTab === 'simulator' && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-center mb-6 max-w-md">
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 block mb-1">
                Interactive Device Preview
              </span>
              <h2 className="text-2xl font-bold text-white">Live Mobile Simulator</h2>
              <p className="text-xs text-white/50 mt-1">
                Test the real-time split calculations, payment method selector, auto-persisted accounts, and clipboard copy in dark mode.
              </p>
            </div>
            <MobileSimulator />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="max-w-4xl mx-auto py-2">
            <CodeViewer />
          </div>
        )}

        {activeTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Mobile Simulator */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 px-2">
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  Live Mobile UI
                </span>
                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
                >
                  <QrCode className="w-3 h-3" />
                  Scan to Open on Phone
                </button>
              </div>
              <MobileSimulator />
            </div>

            {/* Right: Code & Expo Setup */}
            <div className="lg:col-span-7">
              <div className="w-full flex items-center justify-between mb-3 px-2">
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-400" />
                  React Native (Expo) Source
                </span>
                <span className="text-[11px] text-white/40">
                  Ready to paste into `App.js`
                </span>
              </div>
              <CodeViewer />
            </div>
          </div>
        )}
      </main>

      {/* Floating Scan for Mobile Quick Action */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="btn-floating-mobile-qr"
          onClick={() => setIsTestModalOpen(true)}
          className="group flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white pl-3.5 pr-4 py-3 rounded-2xl shadow-[0_10px_30px_-5px_rgba(37,99,235,0.5)] border border-blue-400/30 transition-all duration-200 active:scale-95 hover:shadow-[0_15px_35px_-5px_rgba(37,99,235,0.7)]"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold leading-tight">Scan on Mobile</span>
            <span className="block text-[10px] text-blue-100/70 font-medium">Camera QR Preview</span>
          </div>
        </button>
      </div>

      {/* Test on Mobile Modal */}
      <MobileTestGuide
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}

