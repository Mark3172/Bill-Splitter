import React from 'react';
import { Check, ShieldCheck, UploadCloud, Sparkles, ChevronRight, Copy, Download } from 'lucide-react';
import { PaymentMethod, ProviderConfig } from '../types';

interface PaymentTabProps {
  selectedMethod: PaymentMethod;
  setSelectedMethod: (method: PaymentMethod) => void;
  accounts: Record<PaymentMethod, string>;
  handleAccountChange: (text: string) => void;
  handleCopyAccountOnly: () => void;
  handleCopyQrImageOnly?: () => void;
  handleDownloadReceipt?: () => void;
  isQrCopied?: boolean;
  activeQR: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleRemoveQR: () => void;
  handleSetSampleQR: (method: PaymentMethod) => void;
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  triggerHaptics: () => void;
  onBackToSplit: () => void;
  paymentMethods: PaymentMethod[];
  providerConfigs: Record<PaymentMethod, ProviderConfig>;
  qrCodes: Record<PaymentMethod, string | null>;
}

export default function PaymentTab({
  selectedMethod,
  setSelectedMethod,
  accounts,
  handleAccountChange,
  handleCopyAccountOnly,
  handleCopyQrImageOnly,
  handleDownloadReceipt,
  isQrCopied,
  activeQR,
  fileInputRef,
  handleRemoveQR,
  handleSetSampleQR,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  triggerHaptics,
  onBackToSplit,
  paymentMethods,
  providerConfigs,
  qrCodes,
}: PaymentTabProps) {
  return (
    <div className="space-y-3.5 bs-stagger">
      {/* Provider list — soft chips, Revolut-style selection */}
      <div className="bs-card p-4 space-y-3">
        <div>
          <label className="text-sm font-bold text-white block bs-display">Payment provider</label>
          <p className="text-[11px] text-[var(--bs-text-muted)] mt-0.5">Wallet or bank for friends to pay</p>
        </div>

        <div className="space-y-1.5">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method;
            const config = providerConfigs[method];
            const hasQR = !!qrCodes[method];
            return (
              <button
                key={method}
                id={`btn-payment-${method.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => {
                  triggerHaptics();
                  setSelectedMethod(method);
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between bs-press ${
                  isSelected
                    ? 'bg-white text-black'
                    : 'bg-black/35 text-[var(--bs-text-muted)] hover:text-white hover:bg-[var(--bs-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: isSelected ? config.color : `${config.color}99` }}
                  />
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-black' : 'text-white'}`}>
                    {method}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hasQR && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-600' : 'bg-emerald-400'}`}
                      title="QR Code Attached"
                    />
                  )}
                  {isSelected && <Check className="w-4 h-4 text-black" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-[var(--bs-text-muted)]">
              {selectedMethod} phone / account
            </label>
            <span className="text-[10px] text-[var(--bs-accent)] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" />
              Auto-saved
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              id="input-account-number"
              type="text"
              placeholder={`Enter your ${selectedMethod} details`}
              value={accounts[selectedMethod] || ''}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full bg-black/35 border border-transparent focus:border-[var(--bs-accent)] rounded-2xl px-3.5 py-3 text-sm bs-mono text-white placeholder:text-[var(--bs-text-dim)] outline-none transition pr-16"
            />
            {accounts[selectedMethod] && (
              <button
                type="button"
                onClick={handleCopyAccountOnly}
                className="absolute right-2 text-[10px] font-bold text-black bg-white px-2.5 py-1 rounded-full bs-press"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Large QR card — Phantom / Revolut receive style */}
      <div className="bs-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white bs-display">{selectedMethod} QR</h4>
          <span className="text-[10px] text-[var(--bs-text-muted)]">Photo / screenshot</span>
        </div>

        {activeQR ? (
          <div className="flex flex-col items-center text-center space-y-3 py-1">
            <div className="w-[168px] h-[168px] rounded-3xl bg-white p-3 flex items-center justify-center shadow-[0_12px_40px_-16px_rgba(255,255,255,0.25)]">
              <img
                src={activeQR}
                alt="Bank QR"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Scan to get paid via {selectedMethod}</p>
              <p className="text-[10px] text-[var(--bs-text-muted)] mt-0.5">
                Included when sharing the bill summary
              </p>
            </div>
            <div className="flex items-center gap-2 w-full">
              {handleCopyQrImageOnly && (
                <button
                  type="button"
                  onClick={handleCopyQrImageOnly}
                  className={`flex-1 py-2.5 rounded-full text-[11px] font-bold transition bs-press flex items-center justify-center gap-1.5 ${
                    isQrCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--bs-surface-hover)] text-white'
                  }`}
                  title="Copy QR image to clipboard"
                >
                  {isQrCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {isQrCopied ? 'Copied!' : 'Copy'}
                </button>
              )}
              {handleDownloadReceipt && (
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="flex-1 py-2.5 rounded-full text-[11px] font-bold bg-[var(--bs-surface-hover)] text-white transition bs-press flex items-center justify-center gap-1.5"
                  title="Download receipt image"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-[var(--bs-accent)] font-bold"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemoveQR}
                className="text-[11px] text-red-400 font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[var(--bs-accent)] bg-[var(--bs-accent-soft)]'
                : 'border-[var(--bs-border-strong)] hover:border-[var(--bs-accent)]/50 bg-black/30'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-[var(--bs-accent)] mx-auto mb-2" />
            <span className="text-xs font-bold text-white block">Upload QR screenshot</span>
            <span className="text-[10px] text-[var(--bs-text-muted)] block mt-1 leading-relaxed">
              KBZPay, Wave, AYA, CB, PromptPay — tap or drop
            </span>
          </div>
        )}

        {!activeQR && (
          <button
            type="button"
            onClick={() => handleSetSampleQR(selectedMethod)}
            className="w-full text-[11px] font-semibold text-[var(--bs-accent)] flex items-center justify-center gap-1 py-1"
          >
            <Sparkles className="w-3 h-3" />
            Use sample {selectedMethod} QR
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onBackToSplit}
        className="w-full py-3.5 bg-white hover:bg-white/95 text-black font-bold text-xs rounded-full transition bs-press flex items-center justify-center gap-1.5"
      >
        <span>✓ Done, return to Split</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
