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
    <div className="space-y-3 bs-stagger">
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h2 className="text-lg font-bold text-white bs-display">History</h2>
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
            className="text-[11px] text-red-400 hover:text-red-300 font-semibold px-2 py-1 rounded-full hover:bg-red-500/10 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[var(--bs-surface-raised)] flex items-center justify-center mx-auto text-[var(--bs-text-muted)]">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white block bs-display">No saved splits yet</span>
          <p className="text-xs text-[var(--bs-text-muted)] max-w-[220px] mx-auto leading-relaxed">
            Share or bookmark a bill and it shows up here for quick restore.
          </p>
          <button
            type="button"
            onClick={onStartNewSplit}
            className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold transition bs-press"
          >
            <Plus className="w-3.5 h-3.5" />
            Create first split
          </button>
        </div>
      ) : (
        <div className="bs-card overflow-hidden divide-y divide-[var(--bs-border)]">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onRetrieveHistory(item)}
              className="group px-3.5 py-3.5 hover:bg-white/[0.03] transition-all cursor-pointer select-none"
              title="Click to restore this split calculation"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] text-[var(--bs-text-dim)] bs-mono">{item.dateStr}</span>
                    <span className="text-[10px] text-[var(--bs-text-dim)]">·</span>
                    <span className="text-[10px] text-[var(--bs-text-muted)] truncate">{item.provider}</span>
                  </div>
                  <span className="text-sm font-bold text-white truncate block">{item.eventName}</span>
                  <span className="text-[11px] text-[var(--bs-text-muted)]">
                    {item.numberOfPeople} people · {item.formattedTotal}
                  </span>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <span className="text-sm font-bold bs-mono text-[var(--bs-accent)]">
                    {item.formattedShare}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-white/70 group-hover:text-white flex items-center gap-0.5 bg-white/5 px-2 py-0.5 rounded-full transition">
                      Load
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                    <button
                      type="button"
                      title="Delete this history item"
                      onClick={(e) => onDeleteHistoryItem(item.id, e)}
                      className="p-1 text-[var(--bs-text-dim)] hover:text-red-400 hover:bg-red-500/10 rounded-full transition bs-press"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
