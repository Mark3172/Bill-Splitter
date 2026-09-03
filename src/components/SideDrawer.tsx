import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CurrencyCode, CurrencyConfig } from '../types';
import { SUPPORTED_CURRENCIES, CURRENCY_CONFIGS } from './MobileSimulator';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  onSelectPreset: (
    name: string,
    amounts: Partial<Record<CurrencyCode, string>>,
    people: string
  ) => void;
  copyFormatStyle: 'friendly' | 'clean';
  setCopyFormatStyle: (style: 'friendly' | 'clean') => void;
  includePerPersonInCopy: boolean;
  setIncludePerPersonInCopy: React.Dispatch<React.SetStateAction<boolean>>;
  formattedMessage: string;
  onResetAllData: () => void;
  triggerHaptics: () => void;
}

const DEMO_PRESETS = [
  {
    name: 'Hotpot Dinner',
    amounts: { MMK: '145000', USD: '140.00', EUR: '130.00', THB: '4800', SGD: '180.00', GBP: '110.00' },
    people: '4',
    icon: '🍲',
    desc: '4 people equal split',
  },
  {
    name: 'Friday Ride',
    amounts: { MMK: '18500', USD: '24.00', EUR: '21.00', THB: '450', SGD: '30.00', GBP: '18.00' },
    people: '3',
    icon: '🚕',
    desc: '3 people cab fare',
  },
  {
    name: 'Coffee & Boba',
    amounts: { MMK: '14000', USD: '14.00', EUR: '12.50', THB: '280', SGD: '18.00', GBP: '11.00' },
    people: '2',
    icon: '☕',
    desc: '2 people afternoon drinks',
  },
  {
    name: 'BBQ Gathering',
    amounts: { MMK: '280000', USD: '260.00', EUR: '240.00', THB: '8900', SGD: '340.00', GBP: '210.00' },
    people: '6',
    icon: '🍖',
    desc: '6 people meat & grill',
  },
  {
    name: 'Party Drinks',
    amounts: { MMK: '95000', USD: '90.00', EUR: '85.00', THB: '3200', SGD: '120.00', GBP: '75.00' },
    people: '5',
    icon: '🥂',
    desc: '5 people night out',
  },
];

export default function SideDrawer({
  isOpen,
  onClose,
  selectedCurrency,
  onCurrencyChange,
  onSelectPreset,
  copyFormatStyle,
  setCopyFormatStyle,
  includePerPersonInCopy,
  setIncludePerPersonInCopy,
  formattedMessage,
  onResetAllData,
  triggerHaptics,
}: SideDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative ml-auto w-[85%] h-full bg-[#141722] border-l border-[#2B3142] p-4 flex flex-col shadow-2xl overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200 scrollbar-thin">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-extrabold text-white">Side Tools & Presets</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Quick Demo Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Quick Presets (1-Tap Fill)
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  onSelectPreset(preset.name, preset.amounts, preset.people);
                }}
                className="p-2.5 rounded-xl bg-[#1A1E2A] hover:bg-[#232838] border border-white/5 flex items-center justify-between text-left transition active:scale-95"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{preset.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {preset.desc}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  Load
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Currency Selector */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Select Currency
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {SUPPORTED_CURRENCIES.map((code) => {
              const isSelected = selectedCurrency === code;
              const config = CURRENCY_CONFIGS[code];
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCurrencyChange(code)}
                  className={`p-2 rounded-xl text-center border transition active:scale-95 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-md'
                      : 'bg-[#1A1E2A] border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{config.symbol}</span>
                  <span className="text-[10px] opacity-75 font-mono">{code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Share Message Preferences & Live Preview */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Share Message Format
          </label>

          {/* Emoji vs Plain switcher */}
          <div className="flex items-center gap-1 bg-[#1A1E2A] p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                triggerHaptics();
                setCopyFormatStyle('friendly');
              }}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition ${
                copyFormatStyle === 'friendly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✨ Emoji Style
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptics();
                setCopyFormatStyle('clean');
              }}
              className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition ${
                copyFormatStyle === 'clean'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 Plain Text
            </button>
          </div>

          {/* Include Per Person toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A1E2A] border border-white/5">
            <span className="text-xs text-slate-300 font-medium">
              Include split line
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptics();
                setIncludePerPersonInCopy((prev) => !prev);
              }}
              className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                includePerPersonInCopy ? 'bg-blue-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm block" />
            </button>
          </div>

          {/* Live Text Preview Box */}
          <div className="bg-[#0D0F15] border border-white/5 rounded-xl p-2.5 font-mono text-[10px] text-slate-300 leading-relaxed whitespace-pre-line select-all">
            {formattedMessage}
          </div>
        </div>

        {/* Section 4: App Reset */}
        <div className="pt-2 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={onResetAllData}
            className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition"
          >
            Reset All Stored Data
          </button>
        </div>
      </div>
    </div>
  );
}
