export interface ReceiptData {
  eventName: string;
  formattedTotal: string;
  peopleCount: number;
  formattedShare: string;
  provider: string;
  providerColor: string;
  accountNumber: string;
  qrDataUri: string | null;
  currencySymbol: string;
  formattedMessage: string;
}

/**
 * Loads any image source (data URI or URL, raster or SVG) into an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Helper to draw a rounded rectangle on Canvas 2D
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Generates an ultra-crisp, high-resolution receipt card PNG Blob
 * with embedded QR code, ready for clipboard copying and chat sharing.
 */
export async function generateReceiptImageBlob(data: ReceiptData): Promise<Blob> {
  const width = 640;
  // Calculate height dynamically based on whether QR and account are present
  const hasQR = Boolean(data.qrDataUri);
  const hasAccount = Boolean(data.accountNumber && data.accountNumber.trim().length > 0);
  
  let height = 560;
  if (hasQR) height += 280;
  if (!hasAccount) height -= 40;

  const canvas = document.createElement('canvas');
  canvas.width = width * 2; // 2x retina
  canvas.height = height * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context could not be created');

  ctx.scale(2, 2);

  // Background dark gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#12151F');
  bgGrad.addColorStop(1, '#0C0E14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer subtle border
  ctx.strokeStyle = '#262D3E';
  ctx.lineWidth = 2;
  roundRect(ctx, 16, 16, width - 32, height - 32, 24);
  ctx.stroke();

  // Top accent bar using provider color
  ctx.fillStyle = data.providerColor || '#2563EB';
  roundRect(ctx, 16, 16, width - 32, 12, 6);
  ctx.fill();

  let curY = 56;

  // Header: App badge
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('BILL SPLIT RECEIPT', 36, curY);

  // Provider Pill Tag
  const tagText = `${data.provider.toUpperCase()} • EQUAL SPLIT`;
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const tagWidth = ctx.measureText(tagText).width + 20;
  ctx.fillStyle = `${data.providerColor}25`;
  roundRect(ctx, width - 36 - tagWidth, curY - 14, tagWidth, 24, 12);
  ctx.fill();
  ctx.fillStyle = data.providerColor;
  ctx.fillText(tagText, width - 36 - tagWidth + 10, curY + 2);

  curY += 34;

  // Event Name
  const eventTitle = data.eventName.trim() || 'Dinner & Drinks';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(eventTitle, 36, curY);

  curY += 28;

  // Total Bill & People info
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`Total Bill: `, 36, curY);
  const totalLabelWidth = ctx.measureText('Total Bill: ').width;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${data.formattedTotal} `, 36 + totalLabelWidth, curY);
  
  const totalNumWidth = ctx.measureText(`${data.formattedTotal} `).width;
  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`(${data.peopleCount} people)`, 36 + totalLabelWidth + totalNumWidth, curY);

  curY += 22;

  // Dashed separator line
  ctx.strokeStyle = '#283042';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(36, curY);
  ctx.lineTo(width - 36, curY);
  ctx.stroke();
  ctx.setLineDash([]);

  curY += 24;

  // PER PERSON HIGHLIGHT BOX
  const boxHeight = 96;
  ctx.fillStyle = `${data.providerColor}18`;
  roundRect(ctx, 36, curY, width - 72, boxHeight, 18);
  ctx.fill();
  ctx.strokeStyle = `${data.providerColor}60`;
  ctx.lineWidth = 1.5;
  roundRect(ctx, 36, curY, width - 72, boxHeight, 18);
  ctx.stroke();

  // Highlight Box text
  ctx.fillStyle = data.providerColor;
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`PER PERSON SHARE (${data.peopleCount} ${data.peopleCount > 1 ? 'PEOPLE' : 'PERSON'})`, 54, curY + 28);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.fillText(data.formattedShare, 54, curY + 70);

  curY += boxHeight + 24;

  // Account / Phone line (if available)
  if (hasAccount) {
    ctx.fillStyle = '#181C26';
    roundRect(ctx, 36, curY, width - 72, 48, 14);
    ctx.fill();
    ctx.strokeStyle = '#2B3242';
    ctx.lineWidth = 1;
    roundRect(ctx, 36, curY, width - 72, 48, 14);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Send via ${data.provider}:`, 52, curY + 29);

    const providerLabelWidth = ctx.measureText(`Send via ${data.provider}: `).width;
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.fillText(data.accountNumber, 52 + providerLabelWidth, curY + 29);

    curY += 66;
  }

  // QR CODE SECTION (if attached)
  if (hasQR && data.qrDataUri) {
    try {
      const qrImg = await loadImage(data.qrDataUri);
      
      const qrCardHeight = 220;
      ctx.fillStyle = '#141822';
      roundRect(ctx, 36, curY, width - 72, qrCardHeight, 18);
      ctx.fill();
      ctx.strokeStyle = '#2B3242';
      ctx.lineWidth = 1;
      roundRect(ctx, 36, curY, width - 72, qrCardHeight, 18);
      ctx.stroke();

      // White square container for QR code (guarantees scannability)
      const qrSize = 160;
      const qrX = 54;
      const qrY = curY + (qrCardHeight - qrSize) / 2;

      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, qrX, qrY, qrSize, qrSize, 12);
      ctx.fill();

      // Draw QR image with slight padding inside white container
      ctx.drawImage(qrImg, qrX + 8, qrY + 8, qrSize - 16, qrSize - 16);

      // QR Instruction details to the right
      const textX = qrX + qrSize + 24;
      let textY = qrY + 36;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`Scan with ${data.provider}`, textX, textY);

      textY += 24;
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'normal 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Instant payment via QR code', textX, textY);

      textY += 22;
      ctx.fillStyle = '#64748B';
      ctx.font = 'normal 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Open banking app & scan photo', textX, textY);

      textY += 34;
      // Scannable Verified Pill
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      roundRect(ctx, textX, textY - 14, 130, 24, 6);
      ctx.fill();
      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓ SCANNABLE QR', textX + 10, textY + 2);

      curY += qrCardHeight + 20;
    } catch (err) {
      console.warn('Could not render QR onto canvas', err);
    }
  }

  // Footer note
  ctx.fillStyle = '#475569';
  ctx.font = 'normal 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Polite Group Bill Splitter • Clean receipts for friends & groups', width / 2, height - 28);
  ctx.textAlign = 'start';

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png');
  });
}

/**
 * Copies the complete Receipt Image (with QR code embedded) EXCLUSIVELY as an image/png
 * to the system clipboard.
 * 
 * IMPORTANT: We MUST NOT include 'text/plain' in the same ClipboardItem,
 * because chat apps and browsers prioritize text over images when pasting
 * into input boxes, which causes only text to be pasted instead of the image.
 */
export async function copyReceiptImageOnly(
  data: ReceiptData
): Promise<{ success: boolean; blob: Blob | null; dataUrl: string | null }> {
  try {
    const blob = await generateReceiptImageBlob(data);
    const dataUrl = await blobToDataUrl(blob);

    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof ClipboardItem !== 'undefined'
    ) {
      try {
        const item = new ClipboardItem({
          'image/png': blob,
        });
        await navigator.clipboard.write([item]);
        return { success: true, blob, dataUrl };
      } catch (clipErr) {
        console.warn('ClipboardItem write image/png failed (restricted iframe or unsupported):', clipErr);
        return { success: false, blob, dataUrl };
      }
    }
    return { success: false, blob, dataUrl };
  } catch (err) {
    console.warn('generateReceiptImageBlob failed:', err);
    return { success: false, blob: null, dataUrl: null };
  }
}

/**
 * Converts a Blob to a data URL string for instant image rendering
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Copies ONLY the QR Code image directly to clipboard (image/png only)
 */
export async function copyQrCodeImageOnly(qrDataUri: string): Promise<boolean> {
  try {
    const img = await loadImage(qrDataUri);
    const canvas = document.createElement('canvas');
    const size = Math.max(img.naturalWidth || 300, 300);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Crisp white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 12, 12, size - 24, size - 24);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png')
    );
    if (!blob) return false;

    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (err) {
    console.warn('Failed to copy QR code image', err);
  }
  return false;
}

/**
 * Downloads receipt image directly to device storage
 */
export async function downloadReceiptImage(data: ReceiptData): Promise<void> {
  const blob = await generateReceiptImageBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `receipt-${data.eventName.replace(/[^a-zA-Z0-9]/g, '_') || 'split'}.png`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
