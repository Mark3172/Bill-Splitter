import React from 'react';
import { X, Copy, Download, Share2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#12151F] border border-white/10 rounded-2xl w-full max-w-sm max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#161A26]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Receipt Card & QR</h3>
              <p className="text-[10px] text-slate-400 leading-tight">
                {hasQR ? `High-res image with ${selectedMethod} QR` : 'High-res receipt image'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Image Preview */}
        <div className="p-3.5 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[260px] bg-[#0B0D13]">
          {isGenerating || !receiptDataUrl ? (
            <div className="flex flex-col items-center gap-2.5 py-12 text-slate-400">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Generating high-res card...</span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* The rendered image */}
              <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#141822]">
                <img
                  src={receiptDataUrl}
                  alt="Bill Split Receipt with QR"
                  className="w-full max-h-[50vh] object-contain rounded-xl select-all"
                />
              </div>

              {/* Quick tip on how to paste image */}
              <div className="mt-3 p-2.5 bg-[#161A26] rounded-xl border border-white/10 w-full text-center">
                <p className="text-[11px] text-slate-300 font-medium">
                  {isImageCopied ? (
                    <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 inline" />
                      Image copied! Ready to paste as a photo in chat.
                    </span>
                  ) : (
                    <span>
                      💡 <strong className="text-white">Tip:</strong> In Viber, Telegram, WhatsApp, or Messenger, you can press & hold or right-click the image to <strong className="text-blue-400">Copy</strong> or <strong className="text-blue-400">Save</strong>.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-3 bg-[#161A26] border-t border-white/10 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isGenerating || !receiptDataUrl}
              onClick={onCopyImage}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 border ${
                isImageCopied
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                  : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-md'
              }`}
            >
              {isImageCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isImageCopied ? 'Image Copied!' : 'Copy Image'}</span>
            </button>

            <button
              type="button"
              disabled={isGenerating || !receiptDataUrl}
              onClick={onDownload}
              className="py-2 px-3 rounded-xl font-bold text-xs bg-[#202536] hover:bg-[#2A3146] border border-white/10 text-slate-200 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Save PNG</span>
            </button>
          </div>

          <button
            type="button"
            disabled={isGenerating || !receiptDataUrl}
            onClick={onShare}
            className="w-full py-2 px-3 rounded-xl font-semibold text-xs bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center gap-1.5 border border-white/10 transition active:scale-95"
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
