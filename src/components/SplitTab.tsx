import React from 'react';
import {
  Users,
  Copy,
  Share2,
  BookmarkCheck,
  CheckCircle2,
  Wallet,
  ChevronRight,
  Download,
  Image as ImageIcon,
  Check,
  Eye,
} from 'lucide-react';
import { PaymentMethod, ProviderConfig, CurrencyCode, CurrencyConfig } from '../types';

interface SplitTabProps {
  eventName: string;
  setEventName: (val: string) => void;
  totalBill: string;
  setTotalBill: (val: string) => void;
  numberOfPeople: string;
  setNumberOfPeople: (val: string) => void;
  selectedCurrency: CurrencyCode;
  currentCurrencyConfig: CurrencyConfig;
  selectedMethod: PaymentMethod;
  currentConfig: ProviderConfig;
  activeAccount: string;
  activeQR: string | null;
  calculation: {
    total: number;
    peopleCount: number;
    share: number;
    isValid: boolean;
    formattedTotal: string;
    formattedShare: string;
    formattedMessage: string;
  };
  handleAddAmount: (inc: number) => void;
  triggerHaptics: () => void;
  handleShare: () => void;
  handleOpenReceiptModal: () => void;
  handleCopyReceiptCard: () => void;
  handleCopyQrImageOnly: () => void;
  handleCopyTextOnly: () => void;
  handleCopyAccountOnly: () => void;
  handleDownloadReceipt: () => void;
  saveCalculationToHistory: (calc: any) => void;
  isSharing: boolean;
  isCardCopied: boolean;
  isQrCopied: boolean;
  isCopied: boolean;
  isSavedFeedback: boolean;
  formatNumber: (num: number) => string;
  onOpenPaymentTab: () => void;
  onOpenSideDrawer: () => void;
}

export default function SplitTab({
  eventName,
  setEventName,
  totalBill,
  setTotalBill,
  numberOfPeople,
  setNumberOfPeople,
  selectedCurrency,
  currentCurrencyConfig,
  selectedMethod,
  currentConfig,
  activeAccount,
  activeQR,
  calculation,
  handleAddAmount,
  triggerHaptics,
  handleShare,
  handleOpenReceiptModal,
  handleCopyReceiptCard,
  handleCopyQrImageOnly,
  handleCopyTextOnly,
  handleCopyAccountOnly,
  handleDownloadReceipt,
  saveCalculationToHistory,
  isSharing,
  isCardCopied,
  isQrCopied,
  isCopied,
  isSavedFeedback,
  formatNumber,
  onOpenPaymentTab,
  onOpenSideDrawer,
}: SplitTabProps) {
  return (
    <div className="space-y-3.5 bs-stagger">
      {/* Event name — underline-style field (Splitwise-inspired) */}
      <div className="flex items-center gap-2 px-1 py-1.5 border-b border-[var(--bs-border-strong)] bs-accent-ring transition">
        <span className="text-xs opacity-70">🍽️</span>
        <input
          id="input-event-name"
          type="text"
          placeholder="Event / Location Name (e.g. Hotpot Dinner)"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="bg-transparent text-sm text-white placeholder:text-[var(--bs-text-dim)] outline-none w-full font-medium"
        />
        {eventName && (
          <button
            type="button"
            onClick={() => setEventName('')}
            className="text-[var(--bs-text-dim)] hover:text-slate-300 text-xs px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Hero split summary — Revolut / Wise inspired */}
      <div className="bs-card p-4 relative overflow-hidden">
        <div
          className="absolute -top-16 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentConfig.color }}
        />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentConfig.color }}
            />
            <span className="text-[11px] font-semibold tracking-wide text-[var(--bs-text-muted)]">
              {selectedMethod} · {selectedCurrency}
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenReceiptModal}
            disabled={!calculation.isValid}
            className="text-[11px] text-[var(--bs-accent)] font-semibold flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--bs-accent-soft)] transition bs-press disabled:opacity-40"
            title="Preview Receipt Image & QR"
          >
            <Eye className="w-3 h-3" />
            Preview
          </button>
        </div>

        {/* Big per-person amount — primary visual focus */}
        <div className="relative z-10 text-center py-2 mb-3">
          <p className="text-[11px] font-medium text-[var(--bs-text-muted)] uppercase tracking-[0.14em] mb-1 flex items-center justify-center gap-1.5">
            <Users className="w-3 h-3" />
            Per person · {calculation.peopleCount} {calculation.peopleCount > 1 ? 'people' : 'person'}
          </p>
          <div className="text-[2.35rem] leading-none font-extrabold bs-display text-white tracking-tight">
            {calculation.formattedShare}
          </div>
          <p className="mt-2 text-xs text-[var(--bs-text-muted)]">
            of {calculation.formattedTotal} total
            {eventName.trim() ? ` · ${eventName.trim()}` : ''}
          </p>
          <span
            className="inline-block mt-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${currentConfig.color}22`,
              color: currentConfig.color,
            }}
          >
            {calculation.isValid ? 'Equal split' : 'Enter bill'}
          </span>
        </div>

        {/* Payment + QR strip */}
        {activeAccount.trim().length > 0 && (
          <div className="relative z-10 pt-3 border-t border-[var(--bs-border)] flex items-center justify-between text-[11px]">
            <span className="text-[var(--bs-text-muted)]">{selectedMethod}</span>
            <div className="flex items-center gap-1.5">
              <span className="bs-mono font-semibold text-white/90">{activeAccount}</span>
              <button
                type="button"
                onClick={handleCopyAccountOnly}
                className="p-1 hover:bg-white/10 rounded-md transition text-[var(--bs-text-muted)] hover:text-white"
                title="Copy Account Number"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {activeQR && (
          <div className="relative z-10 mt-3 p-3 rounded-2xl bg-black/40 flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center">
              <img
                src={activeQR}
                alt={`${selectedMethod} QR`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-white">Scan to pay</p>
              <p className="text-[10px] text-[var(--bs-text-muted)] truncate">
                {selectedMethod} QR · friends can scan
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={handleCopyQrImageOnly}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition bs-press ${
                    isQrCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--bs-surface-hover)] text-white/90'
                  }`}
                  title="Copy QR Code Image to Clipboard"
                >
                  {isQrCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {isQrCopied ? 'Copied' : 'Copy QR'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="p-1.5 bg-[var(--bs-surface-hover)] text-slate-300 rounded-full transition"
                  title="Download Receipt Image with QR"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Amount & people controls */}
      <div className="bs-card p-3.5 space-y-3">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[var(--bs-text-muted)]">Total bill</label>
              <span className="text-[10px] text-[var(--bs-text-dim)] bs-mono">{currentCurrencyConfig.symbol}</span>
            </div>
            <div className="relative flex items-center">
              {currentCurrencyConfig.placement === 'prefix' && (
                <span className="absolute left-3.5 bs-mono font-bold text-[var(--bs-accent)] text-sm pointer-events-none select-none">
                  {currentCurrencyConfig.symbol}
                </span>
              )}
              <input
                id="input-total-bill"
                type="text"
                inputMode="decimal"
                placeholder={currentCurrencyConfig.sampleAmount}
                value={totalBill}
                onChange={(e) => setTotalBill(e.target.value)}
                className={`w-full bg-black/35 border border-transparent focus:border-[var(--bs-accent)] rounded-2xl py-2.5 text-sm bs-mono font-semibold text-white placeholder:text-[var(--bs-text-dim)] outline-none transition ${
                  currentCurrencyConfig.placement === 'prefix' ? 'pl-8 pr-3.5' : 'pl-3.5 pr-12'
                }`}
              />
              {currentCurrencyConfig.placement === 'suffix' && (
                <span className="absolute right-3 bs-mono font-bold text-[var(--bs-accent)] text-xs pointer-events-none select-none bg-[var(--bs-surface-hover)] px-1.5 py-0.5 rounded-md">
                  {currentCurrencyConfig.symbol}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {(['MMK', 'THB'].includes(selectedCurrency)
                ? [5000, 10000, 50000]
                : [5, 10, 25]
              ).map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => handleAddAmount(inc)}
                  className="px-2.5 py-1 bg-black/30 hover:bg-[var(--bs-surface-hover)] rounded-full text-[10px] bs-mono font-bold text-[var(--bs-text-muted)] hover:text-white transition bs-press"
                >
                  +{formatNumber(inc)}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-5">
            <label className="text-[11px] font-semibold text-[var(--bs-text-muted)] mb-1.5 block">People</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptics();
                  const current = parseInt(numberOfPeople, 10) || 1;
                  if (current > 1) setNumberOfPeople(String(current - 1));
                }}
                className="w-9 h-10 bg-black/35 hover:bg-[var(--bs-surface-hover)] rounded-2xl text-white text-base font-bold flex items-center justify-center transition bs-press"
              >
                -
              </button>
              <input
                id="input-people-count"
                type="text"
                inputMode="numeric"
                placeholder="2"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                className="w-full bg-black/35 border border-transparent focus:border-[var(--bs-accent)] rounded-2xl py-2 text-center text-sm bs-mono font-semibold text-white placeholder:text-[var(--bs-text-dim)] outline-none transition"
              />
              <button
                type="button"
                onClick={() => {
                  triggerHaptics();
                  const current = parseInt(numberOfPeople, 10) || 0;
                  setNumberOfPeople(String(current + 1));
                }}
                className="w-9 h-10 bg-black/35 hover:bg-[var(--bs-surface-hover)] rounded-2xl text-white text-base font-bold flex items-center justify-center transition bs-press"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {['2', '3', '4', '5'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    triggerHaptics();
                    setNumberOfPeople(num);
                  }}
                  className={`flex-1 py-1 rounded-full text-[10px] bs-mono font-bold transition bs-press ${
                    numberOfPeople === num
                      ? 'bg-white text-black'
                      : 'bg-black/30 text-[var(--bs-text-muted)] hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPaymentTab}
          className="w-full bg-black/30 hover:bg-[var(--bs-surface-hover)] p-2.5 rounded-2xl flex items-center justify-between transition bs-press"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: currentConfig.color }}
            >
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="truncate text-left">
              <span className="text-[10px] text-[var(--bs-text-muted)] block leading-tight">Paying to</span>
              <span className="text-xs font-bold text-white truncate block">
                {selectedMethod}{activeAccount ? ` · ${activeAccount}` : ''}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[var(--bs-accent)] font-semibold flex items-center gap-0.5 shrink-0">
            Change
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* Actions — Revolut white pill CTA */}
      <div className="space-y-2 pt-0.5">
        <button
          id="btn-share-bill-qr"
          type="button"
          disabled={!calculation.isValid || isSharing}
          onClick={handleShare}
          className={`w-full font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all bs-press ${
            calculation.isValid
              ? 'bg-white text-black hover:bg-white/95'
              : 'bg-[var(--bs-surface-raised)] text-[var(--bs-text-dim)] cursor-not-allowed opacity-60'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-extrabold tracking-wide">
            {isSharing
              ? 'Preparing Share Sheet...'
              : activeQR
              ? 'Share Bill & QR Image'
              : 'Share Bill Summary'}
          </span>
        </button>

        <div
          id="receipt-card-action-box"
          className={`w-full font-semibold rounded-2xl flex items-center justify-between transition-all text-xs overflow-hidden ${
            isCardCopied
              ? 'bg-emerald-950/70 ring-1 ring-emerald-500 text-emerald-300'
              : calculation.isValid
              ? 'bg-[var(--bs-surface-raised)] text-slate-200'
              : 'bg-[var(--bs-surface)] text-[var(--bs-text-dim)]'
          }`}
        >
          <button
            id="btn-copy-receipt-card"
            type="button"
            disabled={!calculation.isValid || isCardCopied}
            onClick={handleCopyReceiptCard}
            className="flex-1 py-2.5 pl-3.5 pr-2 flex items-center text-left transition disabled:cursor-not-allowed hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-2.5">
              {isCardCopied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <span className="font-bold text-emerald-300 block">✓ Receipt Image Copied!</span>
                    <span className="text-[10px] text-emerald-400/80">Ready to paste as photo in Viber, Telegram, WhatsApp</span>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-[var(--bs-accent)] shrink-0" />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">
                        Copy Receipt Image {activeQR ? '+ QR Code' : ''}
                      </span>
                      <span className="text-[9px] font-bold bg-[var(--bs-accent-soft)] text-[var(--bs-accent)] px-1.5 py-0.5 rounded-full">
                        PNG
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--bs-text-muted)] block">
                      Copies high-res photo to paste directly into chat
                    </span>
                  </div>
                </>
              )}
            </div>
          </button>
          <div className="pr-2.5 pl-1 shrink-0 flex items-center">
            <button
              id="btn-preview-receipt-card"
              type="button"
              disabled={!calculation.isValid}
              onClick={handleOpenReceiptModal}
              className="p-1.5 text-[var(--bs-text-muted)] hover:text-white hover:bg-white/10 rounded-full transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="Preview Receipt Image"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-copy-text-only"
            type="button"
            disabled={!calculation.isValid || isCopied}
            onClick={handleCopyTextOnly}
            className={`font-semibold py-2.5 px-2.5 rounded-full flex items-center justify-center gap-1.5 transition-all text-xs bs-press ${
              isCopied
                ? 'bg-emerald-950/50 text-emerald-300'
                : calculation.isValid
                ? 'bg-[var(--bs-surface-raised)] text-slate-300 hover:bg-[var(--bs-surface-hover)]'
                : 'bg-[var(--bs-surface)] text-[var(--bs-text-dim)] cursor-not-allowed'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-300">Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[var(--bs-text-muted)]" />
                <span>Copy Text Only</span>
              </>
            )}
          </button>

          <button
            id="btn-download-receipt-png"
            type="button"
            disabled={!calculation.isValid}
            onClick={handleDownloadReceipt}
            className={`font-semibold py-2.5 px-2.5 rounded-full flex items-center justify-center gap-1.5 transition-all text-xs bs-press ${
              calculation.isValid
                ? 'bg-[var(--bs-surface-raised)] text-slate-300 hover:bg-[var(--bs-surface-hover)] hover:text-white'
                : 'bg-[var(--bs-surface)] text-[var(--bs-text-dim)] cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[var(--bs-accent)]" />
            <span>Save PNG</span>
          </button>
        </div>

        <button
          id="btn-save-to-history"
          type="button"
          disabled={!calculation.isValid}
          onClick={() => saveCalculationToHistory(calculation)}
          className={`w-full font-semibold py-2 rounded-full flex items-center justify-center gap-2 transition-all text-[11px] bs-press ${
            isSavedFeedback
              ? 'bg-[var(--bs-accent-soft)] text-[var(--bs-accent)]'
              : calculation.isValid
              ? 'text-[var(--bs-text-muted)] hover:text-slate-200 hover:bg-white/[0.04]'
              : 'text-[var(--bs-text-dim)] cursor-not-allowed'
          }`}
        >
          {isSavedFeedback ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-[var(--bs-accent)]" />
              <span className="font-bold">✓ Saved to History</span>
            </>
          ) : (
            <>
              <BookmarkCheck className="w-3 h-3 text-[var(--bs-text-dim)]" />
              <span>Bookmark this Split</span>
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenSideDrawer}
        className="w-full p-2.5 rounded-2xl flex items-center justify-between text-[var(--bs-text-muted)] hover:text-slate-200 hover:bg-[var(--bs-surface-raised)] transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs">⚡</span>
          <span className="text-[11px] font-medium">
            Presets & currency ({selectedCurrency})
          </span>
        </div>
        <span className="text-[11px] font-bold text-[var(--bs-accent)]">Tools</span>
      </button>
    </div>
  );
}
