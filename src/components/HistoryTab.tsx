import React from 'react';
import { Clock, ArrowUpRight, Trash2, Plus } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryTabProps {
  history: HistoryItem[];
  onRetrieveHistory: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string, e?: React.MouseEvent) => void;
  onClearHistory: () => void;
  onStartNewSplit: () => void;
}

export default function HistoryTab({
  history,
  onRetrieveHistory,
  onDeleteHistoryItem,
  onClearHistory,
  onStartNewSplit,
}: HistoryTabProps) {
  return (
    <div className="space-y-3.5 animate-in fade-in duration-150">
      {/* History Header Card */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-sm font-bold text-white">Calculation History</h2>
          <p className="text-[11px] text-slate-400">
            {history.length > 0
              ? `${history.length} saved split${history.length > 1 ? 's' : ''}`
              : 'No saved splits yet'}
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[10px] text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="p-8 text-center bg-[#151821] border border-[#282E3E] rounded-2xl space-y-2.5">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-200 block">
            No Saved Splits Yet
          </span>
          <p className="text-xs text-slate-400 max-w-[220px] mx-auto leading-relaxed">
            Whenever you calculate a bill and tap "Share" or "Bookmark", it will be saved here for quick reference.
          </p>
          <button
            type="button"
            onClick={onStartNewSplit}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Split</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onRetrieveHistory(item)}
              className="group p-3 bg-[#161922] hover:bg-[#1C202C] border border-[#262C3D] hover:border-blue-500/40 rounded-xl transition-all cursor-pointer select-none shadow-md"
              title="Click to restore this split calculation"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {item.eventName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                    • {item.dateStr}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-0.5 bg-blue-950/50 border border-blue-900/60 px-2 py-0.5 rounded-md transition">
                    <span>Load</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                  <button
                    type="button"
                    title="Delete this history item"
                    onClick={(e) => onDeleteHistoryItem(item.id, e)}
                    className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors border border-transparent hover:border-red-500/20 active:scale-90"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-white/5">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Per Person Share
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {item.formattedShare}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-medium text-slate-300 block">
                    Total: {item.formattedTotal}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item.numberOfPeople} people • {item.provider}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
