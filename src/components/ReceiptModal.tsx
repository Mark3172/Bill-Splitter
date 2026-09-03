import React from 'react';
import { X, Copy, Download, Share2, Check, Image as ImageIcon } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptDataUrl: string | null;
  isGenerating: boolean;
  onCopyImage: () => void;
  onDownload: () => void;
  onShare: () => void;
  isImageCopied: boolean;
  selectedMethod: string;
  hasQR: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptDataUrl,
  isGenerating,
  onCopyImage,
  onDownload,
  onShare,
  isImageCopied,
  selectedMethod,
  hasQR,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm bs-animate-fade">
      <div 
        className="bg-[var(--bs-surface)] border border-[var(--bs-border)] rounded-2xl w-full max-w-sm max-h-[92vh] flex flex-col shadow-2xl overflow-hidden bs-animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3.5 border-b border-[var(--bs-border)] flex items-center justify-between bg-[var(--bs-surface-raised)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--bs-accent-soft)] text-[var(--bs-accent)] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight bs-display">Receipt Card & QR</h3>
              <p className="text-[10px] text-[var(--bs-text-muted)] leading-tight">
                {hasQR ? `High-res image with ${selectedMethod} QR` : 'High-res receipt image'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[var(--bs-text-muted)] hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[260px] bg-[#080a0e]">
          {isGenerating || !receiptDataUrl ? (
            <div className="flex flex-col items-center gap-2.5 py-12 text-[var(--bs-text-muted)]">
              <div className="w-8 h-8 border-2 border-[var(--bs-accent)] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Generating high-res card...</span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="relative group rounded-xl overflow-hidden border border-[var(--bs-border)] shadow-lg bg-[var(--bs-surface)]">
                <img
                  src={receiptDataUrl}
                  alt="Bill Split Receipt with QR"
                  className="w-full max-h-[50vh] object-contain rounded-xl select-all"
                />
              </div>

              <div className="mt-3 p-2.5 bg-[var(--bs-surface-raised)] rounded-xl border border-[var(--bs-border)] w-full text-center">
                <p className="text-[11px] text-slate-300 font-medium">
                  {isImageCopied ? (
                    <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 inline" />
                      Image copied! Ready to paste as a photo in chat.
                    </span>
                  ) : (
                    <span>
                      💡 <strong className="text-white">Tip:</strong> In Viber, Telegram, WhatsApp, or Messenger, you can press & hold or right-click the image to <strong className="text-[var(--bs-accent)]">Copy</strong> or <strong className="text-[var(--bs-accent)]">Save</strong>.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-[var(--bs-surface-raised)] border-t border-[var(--bs-border)] flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isGenerating || !receiptDataUrl}
              onClick={onCopyImage}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition bs-press border ${
                isImageCopied
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                  : 'bg-[var(--bs-accent)] hover:brightness-110 border-[var(--bs-accent)] text-[#04140f] shadow-md'
              }`}
            >
              {isImageCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isImageCopied ? 'Image Copied!' : 'Copy Image'}</span>
            </button>

            <button
              type="button"
              disabled={isGenerating || !receiptDataUrl}
              onClick={onDownload}
              className="py-2 px-3 rounded-xl font-bold text-xs bg-[var(--bs-surface)] hover:bg-[var(--bs-surface-hover)] border border-[var(--bs-border)] text-slate-200 flex items-center justify-center gap-1.5 transition bs-press"
            >
              <Download className="w-3.5 h-3.5 text-[var(--bs-accent)]" />
              <span>Save PNG</span>
            </button>
          </div>

          <button
            type="button"
            disabled={isGenerating || !receiptDataUrl}
            onClick={onShare}
            className="w-full py-2 px-3 rounded-xl font-semibold text-xs bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center gap-1.5 border border-[var(--bs-border)] transition bs-press"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Share Image via Apps...</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
