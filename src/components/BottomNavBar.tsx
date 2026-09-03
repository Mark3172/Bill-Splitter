import React from 'react';
import { Receipt, QrCode, Clock } from 'lucide-react';

export type NavTabType = 'split' | 'payment' | 'history';

interface BottomNavBarProps {
  activeNavTab: NavTabType;
  setActiveNavTab: (tab: NavTabType) => void;
  historyCount: number;
  triggerHaptics: () => void;
}

export default function BottomNavBar({
  activeNavTab,
  setActiveNavTab,
  historyCount,
  triggerHaptics,
}: BottomNavBarProps) {
  const handleTabClick = (tab: NavTabType) => {
    triggerHaptics();
    setActiveNavTab(tab);
  };

  return (
    <div className="bg-[#0c1016] border-t border-[var(--bs-border)] px-3 pt-1.5 pb-1 flex items-center justify-around select-none shrink-0 z-20">
      <button
        id="nav-tab-split"
        type="button"
        onClick={() => handleTabClick('split')}
        className={`flex-1 py-1 flex flex-col items-center gap-0.5 transition ${
          activeNavTab === 'split'
            ? 'text-[var(--bs-accent)] font-bold'
            : 'text-[var(--bs-text-muted)] hover:text-slate-200 font-medium'
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition ${
            activeNavTab === 'split' ? 'bg-[var(--bs-accent-soft)] ring-1 ring-[var(--bs-accent-border)]' : ''
          }`}
        >
          <Receipt className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight">Split</span>
      </button>

      <button
        id="nav-tab-payment"
        type="button"
        onClick={() => handleTabClick('payment')}
        className={`flex-1 py-1 flex flex-col items-center gap-0.5 transition ${
          activeNavTab === 'payment'
            ? 'text-[var(--bs-accent)] font-bold'
            : 'text-[var(--bs-text-muted)] hover:text-slate-200 font-medium'
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition ${
            activeNavTab === 'payment' ? 'bg-[var(--bs-accent-soft)] ring-1 ring-[var(--bs-accent-border)]' : ''
          }`}
        >
          <QrCode className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight">Pay & QR</span>
      </button>

      <button
        id="nav-tab-history"
        type="button"
        onClick={() => handleTabClick('history')}
        className={`flex-1 py-1 flex flex-col items-center gap-0.5 relative transition ${
          activeNavTab === 'history'
            ? 'text-[var(--bs-accent)] font-bold'
            : 'text-[var(--bs-text-muted)] hover:text-slate-200 font-medium'
        }`}
      >
        <div
          className={`p-1.5 rounded-xl transition ${
            activeNavTab === 'history' ? 'bg-[var(--bs-accent-soft)] ring-1 ring-[var(--bs-accent-border)]' : ''
          }`}
        >
          <Clock className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight">History</span>
        {historyCount > 0 && (
          <span className="absolute top-0.5 right-6 w-4 h-4 rounded-full bg-[var(--bs-accent)] text-[#04140f] text-[9px] font-mono font-bold flex items-center justify-center shadow-sm">
            {historyCount}
          </span>
        )}
      </button>
    </div>
  );
}
