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
    <div className="space-y-3.5 bs-stagger">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-sm font-bold text-white bs-display">Calculation History</h2>
          <p className="text-[11px] text-[var(--bs-text-muted)]">
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

      {history.length === 0 ? (
        <div className="p-8 text-center bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-2xl space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bs-surface-raised)] border border-[var(--bs-border)] flex items-center justify-center mx-auto text-[var(--bs-text-muted)]">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-slate-200 block bs-display">
            No Saved Splits Yet
          </span>
          <p className="text-xs text-[var(--bs-text-muted)] max-w-[220px] mx-auto leading-relaxed">
            Whenever you calculate a bill and tap "Share" or "Bookmark", it will be saved here for quick reference.
          </p>
          <button
            type="button"
            onClick={onStartNewSplit}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bs-accent)] hover:brightness-110 text-[#04140f] text-xs font-semibold shadow-[0_8px_20px_-8px_var(--bs-accent-glow)] transition bs-press"
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
              className="group p-3 bg-[var(--bs-surface)] hover:bg-[var(--bs-surface-hover)] border border-[var(--bs-border)] hover:border-[var(--bs-accent-border)] rounded-xl transition-all cursor-pointer select-none"
              title="Click to restore this split calculation"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {item.eventName}
                  </span>
                  <span className="text-[10px] text-[var(--bs-text-dim)] bs-mono flex-shrink-0">
                    · {item.dateStr}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-semibold text-[var(--bs-accent)] group-hover:text-[#4adebf] flex items-center gap-0.5 bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] px-2 py-0.5 rounded-md transition">
                    <span>Load</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                  <button
                    type="button"
                    title="Delete this history item"
                    onClick={(e) => onDeleteHistoryItem(item.id, e)}
                    className="p-1 text-[var(--bs-text-dim)] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors border border-transparent hover:border-red-500/20 bs-press"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-white/5">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--bs-text-muted)] font-semibold block">
                    Per Person Share
                  </span>
                  <span className="text-sm font-bold bs-mono text-[var(--bs-accent)]">
                    {item.formattedShare}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs bs-mono font-medium text-slate-300 block">
                    Total: {item.formattedTotal}
                  </span>
                  <span className="text-[10px] text-[var(--bs-text-dim)]">
                    {item.numberOfPeople} people · {item.provider}
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
