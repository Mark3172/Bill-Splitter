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

  const tabs: { id: NavTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'split', label: 'Split', icon: <Receipt className="w-4 h-4" /> },
    { id: 'payment', label: 'Pay & QR', icon: <QrCode className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-black border-t border-[var(--bs-border)] px-2 pt-1 pb-1 flex items-center justify-around select-none shrink-0 z-20">
      {tabs.map((tab) => {
        const active = activeNavTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id === 'payment' ? 'payment' : tab.id}`}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 relative transition ${
              active
                ? 'text-[var(--bs-accent)] font-bold'
                : 'text-[var(--bs-text-dim)] hover:text-[var(--bs-text-muted)] font-medium'
            }`}
          >
            {/* Splitwise-style active indicator line */}
            {active && (
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--bs-accent)]" />
            )}
            <div className="p-1 relative">
              {tab.icon}
              {tab.id === 'history' && historyCount > 0 && (
                <span className="absolute -top-0.5 -right-1.5 min-w-4 h-4 px-0.5 rounded-full bg-[var(--bs-accent)] text-black text-[9px] font-mono font-bold flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
