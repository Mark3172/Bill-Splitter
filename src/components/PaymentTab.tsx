import React from 'react';
import { QrCode, Check, ShieldCheck, UploadCloud, Sparkles, ChevronRight, Copy, Download } from 'lucide-react';
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
      <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-2xl p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-white block uppercase tracking-[0.1em]">
              Payment Provider
            </label>
            <p className="text-[10px] text-[var(--bs-text-muted)]">Choose the wallet or bank for friends to pay</p>
          </div>
          <span className="text-[10px] font-bold text-[var(--bs-accent)] bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] px-2 py-0.5 rounded-md">
            Any Bank
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
                className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between border text-left bs-press ${
                  isSelected
                    ? 'text-white'
                    : 'bg-[var(--bs-surface-raised)] border-[var(--bs-border)] text-[var(--bs-text-muted)] hover:text-slate-200 hover:bg-[var(--bs-surface-hover)]'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: config.color,
                        borderColor: config.borderColor,
                        boxShadow: `0 6px 18px -6px ${config.color}70`,
                      }
                    : undefined
                }
              >
                <span className="truncate">{method}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {hasQR && (
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      title="QR Code Attached"
                    />
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              {selectedMethod} Phone / Account Number
            </label>
            <span className="text-[10px] text-[var(--bs-accent)] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" />
              Auto-Saved
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              id="input-account-number"
              type="text"
              placeholder={`Enter your ${selectedMethod} details`}
              value={accounts[selectedMethod] || ''}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full bg-[var(--bs-surface-raised)] border border-[var(--bs-border)] focus:border-[var(--bs-accent)] rounded-xl px-3.5 py-2.5 text-sm bs-mono text-white placeholder:text-[var(--bs-text-dim)] outline-none transition pr-16"
            />
            {accounts[selectedMethod] && (
              <button
                type="button"
                onClick={handleCopyAccountOnly}
                className="absolute right-2 text-[10px] font-bold text-[var(--bs-accent)] hover:text-[#4adebf] bg-[var(--bs-accent-soft)] px-2 py-1 rounded-lg border border-[var(--bs-accent-border)] bs-press"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[var(--bs-accent-soft)] border border-[var(--bs-accent-border)] flex items-center justify-center text-[var(--bs-accent)]">
              <QrCode className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                {selectedMethod} QR Code
              </h4>
            </div>
          </div>
          <span className="text-[10px] text-[var(--bs-text-muted)] font-medium">
            Photo / Screenshot
          </span>
        </div>

        {activeQR ? (
          <div className="bg-[var(--bs-surface-raised)] border border-[var(--bs-border)] rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-black border border-white/20 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-md">
                <img
                  src={activeQR}
                  alt="Bank QR"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  QR Attached for {selectedMethod}
                </span>
                <span className="text-[10px] text-[var(--bs-text-muted)] block mt-0.5">
                  Included when sharing bill summary
                </span>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {handleCopyQrImageOnly && (
                    <button
                      type="button"
                      onClick={handleCopyQrImageOnly}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition bs-press flex items-center gap-1 ${
                        isQrCopied
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'text-[var(--bs-accent)] hover:text-[#4adebf] bg-[var(--bs-accent-soft)] border-[var(--bs-accent-border)]'
                      }`}
                      title="Copy QR image to clipboard"
                    >
                      {isQrCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isQrCopied ? 'Copied!' : 'Copy QR'}</span>
                    </button>
                  )}
                  {handleDownloadReceipt && (
                    <button
                      type="button"
                      onClick={handleDownloadReceipt}
                      className="text-[11px] text-slate-300 hover:text-white font-medium bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md border border-white/10 bs-press flex items-center gap-1"
                      title="Download receipt image"
                    >
                      <Download className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[var(--bs-accent)] hover:text-[#4adebf] font-bold bg-[var(--bs-accent-soft)] px-2 py-0.5 rounded-md border border-[var(--bs-accent-border)] bs-press"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveQR}
                    className="text-[11px] text-red-400 hover:text-red-300 font-semibold px-2 py-0.5 rounded-md hover:bg-red-500/10 bs-press"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[var(--bs-accent)] bg-[var(--bs-accent-soft)]'
                : 'border-[var(--bs-border-strong)] hover:border-[var(--bs-accent)]/60 bg-[var(--bs-surface-raised)]'
            }`}
          >
            <UploadCloud className="w-7 h-7 text-[var(--bs-accent)] mx-auto mb-1.5" />
            <span className="text-xs font-bold text-white block">
              Upload QR Code Screenshot
            </span>
            <span className="text-[10px] text-[var(--bs-text-muted)] block mt-0.5 leading-relaxed">
              Tap to browse photos or drop screenshot from any banking app (KBZPay, Wave, AYA, CB, PromptPay)
            </span>
          </div>
        )}

        {!activeQR && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[var(--bs-text-dim)]">Need a demo QR code?</span>
            <button
              type="button"
              onClick={() => handleSetSampleQR(selectedMethod)}
              className="text-[10px] font-semibold text-[var(--bs-accent)] hover:text-[#4adebf] flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Use Sample {selectedMethod} QR</span>
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onBackToSplit}
        className="w-full py-3 bg-[var(--bs-accent)] hover:brightness-110 text-[#04140f] font-bold text-xs rounded-xl shadow-[0_8px_24px_-8px_var(--bs-accent-glow)] transition bs-press flex items-center justify-center gap-1.5"
      >
        <span>✓ Done, Return to Split</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
