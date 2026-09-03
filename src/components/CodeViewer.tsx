import React, { useState } from 'react';
import { EXPO_APP_JS, EXPO_INSTALL_COMMAND } from '../expoCode';
import { Copy, Check, Terminal, FileCode, Download } from 'lucide-react';

export default function CodeViewer() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(EXPO_INSTALL_COMMAND);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const copyAppJsCode = async () => {
    try {
      await navigator.clipboard.writeText(EXPO_APP_JS);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadAppJs = () => {
    const blob = new Blob([EXPO_APP_JS], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'App.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      <div className="p-6 rounded-3xl border border-[var(--bs-border)] bg-white/[0.03] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-8 h-8 rounded-xl bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] flex items-center justify-center text-[var(--bs-accent)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white bs-display">1. Expo Dependencies Installation</h3>
              <p className="text-[11px] text-[var(--bs-text-dim)]">Run inside your project terminal</p>
            </div>
          </div>
          <button
            id="btn-copy-install-cmd"
            type="button"
            onClick={copyInstallCommand}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition bs-press ${
              copiedInstall
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
            }`}
          >
            {copiedInstall ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied Command!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Terminal Command
              </>
            )}
          </button>
        </div>

        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 bs-mono text-xs text-[var(--bs-accent)] border border-[var(--bs-border)] overflow-x-auto flex items-center justify-between gap-3">
          <code className="select-all">{EXPO_INSTALL_COMMAND}</code>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-[var(--bs-border)] bg-white/[0.03] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-8 h-8 rounded-xl bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] flex items-center justify-center text-[var(--bs-accent)]">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white bs-display">2. Complete Single-File `App.js`</h3>
              <p className="text-xs text-[var(--bs-text-dim)]">
                Self-contained React Native Expo MVP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-download-app-js"
              type="button"
              onClick={downloadAppJs}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition bs-press"
            >
              <Download className="w-3.5 h-3.5 text-white/60" />
              Download App.js
            </button>
            <button
              id="btn-copy-full-code"
              type="button"
              onClick={copyAppJsCode}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition bs-press ${
                copiedCode
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied Complete Code!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative bg-black/50 backdrop-blur-xl border border-[var(--bs-border)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-[var(--bs-border)] text-[11px] text-white/40 bs-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-white/70">App.js</span>
            </div>
            <span>JavaScript (React Native / Expo)</span>
          </div>

          <pre className="p-5 text-xs bs-mono text-slate-300 overflow-x-auto max-h-[580px] leading-relaxed scrollbar-thin">
            <code>{EXPO_APP_JS}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
