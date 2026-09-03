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
    <div className="bg-[#12151D] border-t border-[#232838] px-3 pt-1.5 pb-1 flex items-center justify-around select-none shrink-0 z-20">
      {/* Split Tab */}
      <button
        id="nav-tab-split"
        type="button"
        onClick={() => handleTabClick('split')}
        className={`flex-1 py-1 flex flex-col items-center gap-0.5 transition ${
          activeNavTab === 'split'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200 font-medium'
        }`}
      >
        <div
          className={`p-1 rounded-xl transition ${
            activeNavTab === 'split' ? 'bg-blue-500/15 ring-1 ring-blue-500/30' : ''
          }`}
        >
          <Receipt className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight">Split</span>
      </button>

      {/* Pay & QR Tab */}
      <button
        id="nav-tab-payment"
        type="button"
        onClick={() => handleTabClick('payment')}
        className={`flex-1 py-1 flex flex-col items-center gap-0.5 transition ${
          activeNavTab === 'payment'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200 font-medium'
        }`}
      >
        <div
          className={`p-1 rounded-xl transition ${
            activeNavTab === 'payment' ? 'bg-blue-500/15 ring-1 ring-blue-500/30' : ''
          }`}
        >
          <QrCode className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight">Pay & QR</span>
      </button>

      {/* History Tab */}
      <button
        id="nav-tab-history"
        type="button"
        onClick={() => handleTabClick('history')}
        className={`flex-1 py-1 flex flex-col items-center gap-0.5 relative transition ${
          activeNavTab === 'history'
            ? 'text-blue-400 font-bold'
            : 'text-slate-400 hover:text-slate-200 font-medium'
        }`}
      >
        <div
          className={`p-1 rounded-xl transition ${
            activeNavTab === 'history' ? 'bg-blue-500/15 ring-1 ring-blue-500/30' : ''
          }`}
        >
          <Clock className="w-4 h-4" />
        </div>
        <span className="text-[10px] tracking-tight">History</span>
        {historyCount > 0 && (
          <span className="absolute top-0.5 right-6 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-sm">
            {historyCount}
          </span>
        )}
      </button>
    </div>
  );
}
