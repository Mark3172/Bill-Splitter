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
    <div className="space-y-3.5 animate-in fade-in duration-150">
      {/* Event Name Pill (Clean & unobtrusive) */}
      <div className="flex items-center gap-2 bg-[#161922] border border-[#262C3D] rounded-xl px-3 py-2 focus-within:border-blue-500 transition">
        <span className="text-xs">🍽️</span>
        <input
          id="input-event-name"
          type="text"
          placeholder="Event / Location Name (e.g. Hotpot Dinner)"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="bg-transparent text-xs text-white placeholder:text-slate-500 outline-none w-full font-medium"
        />
        {eventName && (
          <button
            type="button"
            onClick={() => setEventName('')}
            className="text-slate-500 hover:text-slate-300 text-xs px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* The Hero Per-Person Receipt Card */}
      <div className="bg-[#171A21] border border-[#2B3140] rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        {/* Ambient Radial Glow */}
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentConfig.color }}
        />

        {/* Top Receipt Badge */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2 bg-[#1F232E] px-2.5 py-1 rounded-full border border-white/5">
            <span
              className="w-2 h-2 rounded-full shadow-sm"
              style={{ backgroundColor: currentConfig.color }}
            />
            <span className="text-[10px] font-bold tracking-wider text-slate-200 uppercase">
              {selectedMethod} RECEIPT • {selectedCurrency}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleOpenReceiptModal}
              disabled={!calculation.isValid}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2 py-0.5 rounded-full transition active:scale-95 disabled:opacity-50"
              title="Preview Receipt Image & QR"
            >
              <Eye className="w-3 h-3" />
              <span>Preview Card</span>
            </button>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
              {currentCurrencyConfig.symbol}
            </span>
          </div>
        </div>

        {/* Receipt Line Items */}
        <div className="space-y-2 relative z-10 text-xs">
          {eventName.trim().length > 0 && (
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 flex items-center gap-1">
                <span>🍽️</span> Event:
              </span>
              <span className="font-semibold text-white truncate max-w-[170px]">
                {eventName.trim()}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 flex items-center gap-1">
              <span>💰</span> Total Bill:
            </span>
            <span className="font-mono font-bold text-white">
              {calculation.formattedTotal}
            </span>
          </div>

          {/* PER PERSON HIGHLIGHT CONTAINER (Polite Group Sharing) */}
          <div
            className="p-3 rounded-xl flex items-center justify-between border transition-all mt-1"
            style={{
              backgroundColor: `${currentConfig.color}15`,
              borderColor: `${currentConfig.borderColor}50`,
            }}
          >
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                style={{ color: currentConfig.color }}
              >
                <Users className="w-3 h-3" />
                Per Person ({calculation.peopleCount} {calculation.peopleCount > 1 ? 'people' : 'person'}):
              </span>
              <div className="text-xl font-black font-mono tracking-tight text-white mt-0.5">
                {calculation.formattedShare}
              </div>
            </div>
            <span
              className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-sm"
              style={{
                backgroundColor: currentConfig.color,
                borderColor: currentConfig.borderColor,
                color: '#FFFFFF',
              }}
            >
              {calculation.isValid ? 'EQUAL SPLIT' : 'ENTER BILL'}
            </span>
          </div>

          {/* Payment Details Snippet on Receipt */}
          {activeAccount.trim().length > 0 && (
            <div className="pt-2 border-t border-dashed border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <span>📱</span> {selectedMethod}:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-slate-200">
                  {activeAccount}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccountOnly}
                  className="p-1 hover:bg-white/10 rounded transition text-slate-400 hover:text-white"
                  title="Copy Account Number"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Embedded Scannable QR Code on Receipt */}
          {activeQR && (
            <div className="pt-2.5 border-t border-dashed border-white/10 mt-1">
              <div className="bg-[#10131B] border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* High contrast white box for optimal scanning */}
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center shadow-md">
                    <img
                      src={activeQR}
                      alt={`${selectedMethod} QR`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-emerald-400">✓ SCANNABLE QR</span>
                      <span className="text-[9px] text-slate-500">• {selectedMethod}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-300 truncate">
                      Friends can scan or pay
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyQrImageOnly}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                      isQrCopied
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-[#1E2330] hover:bg-[#272D3E] text-slate-200 border border-white/10'
                    }`}
                    title="Copy QR Code Image to Clipboard"
                  >
                    {isQrCopied ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <Copy className="w-3 h-3 text-blue-400" />
                    )}
                    <span>{isQrCopied ? 'Copied' : 'Copy QR'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="p-1.5 bg-[#1E2330] hover:bg-[#272D3E] text-slate-300 rounded-lg border border-white/10 transition"
                    title="Download Receipt Image with QR"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notched Receipt Cutouts */}
        <div className="absolute -left-2.5 bottom-12 w-5 h-5 rounded-full bg-[#101216] border-r border-[#2B3140]" />
        <div className="absolute -right-2.5 bottom-12 w-5 h-5 rounded-full bg-[#101216] border-l border-[#2B3140]" />
      </div>

      {/* Amount & People Numeric Controls */}
      <div className="bg-[#151821] border border-[#282E3E] rounded-2xl p-3.5 space-y-3 shadow-lg">
        <div className="grid grid-cols-12 gap-3">
          {/* Total Bill Input */}
          <div className="col-span-7">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Total Bill
              </label>
              <span className="text-[10px] text-slate-400 font-mono font-semibold">
                {currentCurrencyConfig.symbol}
              </span>
            </div>
            <div className="relative flex items-center">
              {currentCurrencyConfig.placement === 'prefix' && (
                <span className="absolute left-3.5 font-mono font-bold text-blue-400 text-sm pointer-events-none select-none">
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
                className={`w-full bg-[#1A1D24] border border-[#2B3140] focus:border-blue-500 rounded-xl py-2 text-sm font-mono font-semibold text-white placeholder:text-slate-500 outline-none transition ${
                  currentCurrencyConfig.placement === 'prefix' ? 'pl-8 pr-3.5' : 'pl-3.5 pr-12'
                }`}
              />
              {currentCurrencyConfig.placement === 'suffix' && (
                <span className="absolute right-3 font-mono font-bold text-blue-400 text-xs pointer-events-none select-none bg-[#242938] px-1.5 py-0.5 rounded border border-white/10">
                  {currentCurrencyConfig.symbol}
                </span>
              )}
            </div>

            {/* Quick Increment Chips */}
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[9px] text-slate-500 font-medium uppercase">Add:</span>
              {(['MMK', 'THB'].includes(selectedCurrency)
                ? [5000, 10000, 50000]
                : [5, 10, 25]
              ).map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => handleAddAmount(inc)}
                  className="px-1.5 py-0.5 bg-[#202532] hover:bg-[#282F3F] border border-white/5 rounded text-[10px] font-mono font-bold text-slate-300 transition active:scale-95"
                >
                  +{formatNumber(inc)}
                </button>
              ))}
            </div>
          </div>

          {/* People Stepper */}
          <div className="col-span-5">
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              People
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  triggerHaptics();
                  const current = parseInt(numberOfPeople, 10) || 1;
                  if (current > 1) setNumberOfPeople(String(current - 1));
                }}
                className="w-8 h-9 bg-[#1A1D24] border border-[#2B3140] hover:bg-[#232732] rounded-lg text-slate-300 text-base font-bold flex items-center justify-center transition active:scale-95"
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
                className="w-full bg-[#1A1D24] border border-[#2B3140] focus:border-blue-500 rounded-xl py-1.5 text-center text-sm font-mono font-semibold text-white placeholder:text-slate-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => {
                  triggerHaptics();
                  const current = parseInt(numberOfPeople, 10) || 0;
                  setNumberOfPeople(String(current + 1));
                }}
                className="w-8 h-9 bg-[#1A1D24] border border-[#2B3140] hover:bg-[#232732] rounded-lg text-slate-300 text-base font-bold flex items-center justify-center transition active:scale-95"
              >
                +
              </button>
            </div>

            {/* Quick People Count Pills */}
            <div className="flex items-center justify-between gap-1 mt-1.5">
              {['2', '3', '4', '5'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    triggerHaptics();
                    setNumberOfPeople(num);
                  }}
                  className={`flex-1 py-0.5 rounded text-[10px] font-mono font-bold transition active:scale-95 ${
                    numberOfPeople === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#202532] text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {num}p
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Payment Snippet Button (Direct link to Pay & QR tab) */}
        <div
          onClick={onOpenPaymentTab}
          className="bg-[#1A1E29] hover:bg-[#202533] border border-white/5 hover:border-white/10 p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition active:scale-[0.99] mt-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] text-white font-bold shrink-0"
              style={{ backgroundColor: currentConfig.color }}
            >
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block leading-tight">Paying to</span>
              <span className="text-xs font-bold text-slate-200 truncate block">
                {selectedMethod} {activeAccount ? `(${activeAccount})` : ''}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-0.5 shrink-0 pl-1">
            <span>Change & QR</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {/* Primary: Share Bill & QR */}
        <button
          id="btn-share-bill-qr"
          type="button"
          disabled={!calculation.isValid || isSharing}
          onClick={handleShare}
          className={`w-full font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all ${
            calculation.isValid
              ? 'text-white active:scale-[0.98]'
              : 'bg-[#1A1D24] text-slate-600 border border-[#2B3140] cursor-not-allowed opacity-60'
          }`}
          style={
            calculation.isValid
              ? {
                  backgroundColor: currentConfig.color,
                  boxShadow: `0 4px 20px ${currentConfig.color}60`,
                }
              : undefined
          }
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

        {/* Secondary: Copy Receipt Card Image (Pure PNG for chat apps) */}
        <div
          id="receipt-card-action-box"
          className={`w-full font-semibold rounded-2xl flex items-center justify-between border transition-all text-xs overflow-hidden ${
            isCardCopied
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-md'
              : calculation.isValid
              ? 'bg-[#181B26] border-blue-500/30 hover:border-blue-500/60 text-slate-200'
              : 'bg-[#14161E] border-[#222735] text-slate-600'
          }`}
        >
          <button
            id="btn-copy-receipt-card"
            type="button"
            disabled={!calculation.isValid || isCardCopied}
            onClick={handleCopyReceiptCard}
            className="flex-1 py-2.5 pl-3.5 pr-2 flex items-center text-left transition active:scale-[0.99] disabled:cursor-not-allowed hover:bg-white/5"
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
                  <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">
                        Copy Receipt Image {activeQR ? '+ QR Code' : ''}
                      </span>
                      <span className="text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
                        PNG Photo
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
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
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
              title="Preview Receipt Image"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tertiary: Copy Text & Download PNG Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-copy-text-only"
            type="button"
            disabled={!calculation.isValid || isCopied}
            onClick={handleCopyTextOnly}
            className={`font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all text-xs active:scale-[0.98] ${
              isCopied
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                : calculation.isValid
                ? 'bg-[#151821] border-[#252B3C] hover:bg-[#1C212E] text-slate-300'
                : 'bg-[#14161E] border-[#222735] text-slate-600 cursor-not-allowed'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-300">Text Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Text Only</span>
              </>
            )}
          </button>

          <button
            id="btn-download-receipt-png"
            type="button"
            disabled={!calculation.isValid}
            onClick={handleDownloadReceipt}
            className={`font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 border transition-all text-xs active:scale-[0.98] ${
              calculation.isValid
                ? 'bg-[#151821] border-[#252B3C] hover:bg-[#1C212E] text-slate-300 hover:text-white'
                : 'bg-[#14161E] border-[#222735] text-slate-600 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Save PNG</span>
          </button>
        </div>

        {/* Quaternary: Bookmark / Save to History */}
        <button
          id="btn-save-to-history"
          type="button"
          disabled={!calculation.isValid}
          onClick={() => saveCalculationToHistory(calculation)}
          className={`w-full font-semibold py-1.5 rounded-2xl flex items-center justify-center gap-2 border transition-all text-[11px] active:scale-[0.98] ${
            isSavedFeedback
              ? 'bg-blue-950/50 border-blue-500 text-blue-300'
              : calculation.isValid
              ? 'bg-[#13151D] border-[#1F2432] hover:bg-[#1A1D27] text-slate-400 hover:text-slate-200'
              : 'bg-[#12141A] border-[#1C202B] text-slate-600 cursor-not-allowed'
          }`}
        >
          {isSavedFeedback ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-300 font-bold">✓ Saved to History</span>
            </>
          ) : (
            <>
              <BookmarkCheck className="w-3 h-3 text-slate-500" />
              <span>Bookmark this Split</span>
            </>
          )}
        </button>
      </div>

      {/* Side Tools Hint Banner */}
      <div
        onClick={onOpenSideDrawer}
        className="p-2.5 bg-[#141721] border border-white/5 hover:border-blue-500/30 rounded-xl flex items-center justify-between cursor-pointer transition text-slate-400 hover:text-slate-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs">⚡</span>
          <span className="text-[11px] font-medium">
            Need presets or switch currency ({selectedCurrency})?
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-400 flex items-center">
          Tools &gt;
        </span>
      </div>
    </div>
  );
}
