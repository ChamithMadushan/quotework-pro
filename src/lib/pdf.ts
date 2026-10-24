import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Quotation, QuotationTotals } from '../types/quotation';
import { formatDisplayDate } from './ids';

/**
 * Measure natural image dimensions to preserve logo aspect ratio without distortion.
 */
function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !dataUrl) {
      resolve({ width: 100, height: 100 });
      return;
    }
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || 100,
        height: img.naturalHeight || 100,
      });
    };
    img.onerror = () => {
      resolve({ width: 100, height: 100 });
    };
    img.src = dataUrl;
  });
}

/**
 * Clean ASCII-safe currency formatter for PDF vector text output.
 * Ensures consistent rendering across all standard PDF viewers.
 */
function formatPdfCurrency(amount: number, currencyCode: string): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currencyCode} ${formatted}`;
}

/**
 * Generates a genuine vector A4 PDF document for the quotation.
 * Supports multi-page pagination, auto-wrapping descriptions, repeated headers,
 * graceful handling of optional fields, and precise financial breakdown.
 */
export async function generateQuotationPdf(
  quotation: Quotation,
  totals: QuotationTotals,
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 14;
  const rightMargin = 14;
  const printableWidth = pageWidth - leftMargin - rightMargin; // 182mm
  const rightX = leftMargin + printableWidth; // 196mm
  const bottomThreshold = pageHeight - 20; // 277mm

  // Colors
  const navy: [number, number, number] = [15, 64, 96]; // #0f4060
  const teal: [number, number, number] = [14, 169, 138]; // #0ea98a
  const textDark: [number, number, number] = [15, 23, 42]; // #0f172a
  const textMuted: [number, number, number] = [100, 116, 139]; // #64748b
  const lineLight: [number, number, number] = [226, 232, 240]; // #e2e8f0
  const bgLight: [number, number, number] = [248, 250, 252]; // #f8fafc
  const greenDiscount: [number, number, number] = [22, 101, 52];

  // ─────────────────────────────────────────────────────────────
  // 1. TOP HEADER BANNER
  // ─────────────────────────────────────────────────────────────
  const headerHeight = 36;
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  // Decorative subtle accent bar at bottom of header
  doc.setFillColor(...teal);
  doc.rect(0, headerHeight - 1.5, pageWidth, 1.5, 'F');

  // Business logo handling (preserve aspect ratio)
  let bizNameX = leftMargin;
  const bizNameY = 16;

  if (quotation.business.logoDataUrl) {
    try {
      const { width: origW, height: origH } = await getImageDimensions(quotation.business.logoDataUrl);
      const maxLogoW = 38;
      const maxLogoH = 22;
      const ratio = Math.min(maxLogoW / origW, maxLogoH / origH);
      const logoW = origW * ratio;
      const logoH = origH * ratio;
      const logoY = (headerHeight - 2 - logoH) / 2;

      // Extract image format
      const isPng = quotation.business.logoDataUrl.startsWith('data:image/png');
      const format = isPng ? 'PNG' : 'JPEG';

      doc.addImage(quotation.business.logoDataUrl, format, leftMargin, logoY, logoW, logoH);
      bizNameX = leftMargin + logoW + 6;
    } catch {
      // Fallback if logo rendering fails
      bizNameX = leftMargin;
    }
  }

  // Business Name in header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  const senderName = quotation.business.name || quotation.business.company || 'Business Quotation';
  doc.text(senderName, bizNameX, bizNameY);

  if (quotation.business.company && quotation.business.name) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text(quotation.business.company, bizNameX, bizNameY + 5);
  }

  // Right side: QUOTATION Title & Number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('QUOTATION', rightX, 16, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(204, 251, 241); // soft teal
  doc.text(quotation.number || 'QT-DRAFT', rightX, 23, { align: 'right' });

  // ─────────────────────────────────────────────────────────────
  // 2. PARTIES & METADATA SECTION
  // ─────────────────────────────────────────────────────────────
  let cursorY = headerHeight + 8;

  // Left Box: Customer (Prepared For)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...teal);
  doc.text('PREPARED FOR / CLIENT', leftMargin, cursorY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...textDark);
  const customerName = quotation.customer.company || quotation.customer.name || 'Valued Customer';
  doc.text(customerName, leftMargin, cursorY + 5);

  let custY = cursorY + 9.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);

  if (quotation.customer.name && quotation.customer.company) {
    doc.text(`Attn: ${quotation.customer.name}`, leftMargin, custY);
    custY += 4.2;
  }
  const custAddr = [quotation.customer.address, quotation.customer.city].filter(Boolean).join(', ');
  if (custAddr) {
    const splitAddr = doc.splitTextToSize(custAddr, 80);
    doc.text(splitAddr, leftMargin, custY);
    custY += splitAddr.length * 4.2;
  }
  const custContact = [quotation.customer.phone, quotation.customer.email].filter(Boolean).join(' · ');
  if (custContact) {
    doc.text(custContact, leftMargin, custY);
    custY += 4.2;
  }

  // Right Box: Document Metadata & From details
  const metaColX = 112;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...teal);
  doc.text('QUOTATION DETAILS', metaColX, cursorY);

  let metaY = cursorY + 5;
  doc.setFontSize(8.5);

  const metaRows: [string, string][] = [
    ['Date:', formatDisplayDate(quotation.date)],
    ['Valid Until:', quotation.validUntil ? formatDisplayDate(quotation.validUntil) : 'Upon confirmation'],
    ['Currency:', quotation.currency],
  ];

  if (quotation.projectReference) {
    metaRows.push(['Project / Ref:', quotation.projectReference]);
  }
  if (quotation.business.taxId) {
    metaRows.push(['Tax / BRN ID:', quotation.business.taxId]);
  }
  const bizContact = [quotation.business.phone, quotation.business.email].filter(Boolean).join(' · ');
  if (bizContact) {
    metaRows.push(['Contact:', bizContact]);
  }

  for (const [label, val] of metaRows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text(label, metaColX, metaY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    const splitVal = doc.splitTextToSize(val, 55);
    doc.text(splitVal, metaColX + 26, metaY);
    metaY += Math.max(1, splitVal.length) * 4.2;
  }

  cursorY = Math.max(custY, metaY) + 5;

  // Horizontal divider
  doc.setDrawColor(...lineLight);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, cursorY, rightX, cursorY);
  cursorY += 6;

  // ─────────────────────────────────────────────────────────────
  // 3. ITEM TABLE (WITH AUTOTABLE)
  // ─────────────────────────────────────────────────────────────
  const tableRows = quotation.items
    .filter((item) => item.description.trim().length > 0)
    .map((item, index) => {
      const line = totals.lines.find((entry) => entry.id === item.id);
      const discountText =
        item.discountType === 'percent'
          ? `${item.discountValue}%`
          : item.discountType === 'amount'
          ? formatPdfCurrency(item.discountValue, quotation.currency)
          : '—';

      return [
        (index + 1).toString(),
        item.description,
        item.quantity.toString(),
        formatPdfCurrency(item.unitPrice, quotation.currency),
        discountText,
        formatPdfCurrency(line?.net ?? 0, quotation.currency),
      ];
    });

  // If no items, show a placeholder row
  const bodyData =
    tableRows.length > 0
      ? tableRows
      : [['1', 'No line items specified', '1', formatPdfCurrency(0, quotation.currency), '—', formatPdfCurrency(0, quotation.currency)]];

  autoTable(doc, {
    startY: cursorY,
    margin: { left: leftMargin, right: rightMargin, top: 18, bottom: 22 },
    head: [['#', 'Description', 'Qty', 'Unit Price', 'Discount', 'Amount']],
    body: bodyData,
    theme: 'grid',
    showHead: 'everyPage', // REPEAT COLUMN HEADINGS ON SUBSEQUENT PAGES
    rowPageBreak: 'avoid', // PREVENT TABLE ROWS FROM BEING CLIPPED
    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: bgLight,
    },
    bodyStyles: {
      fontSize: 8.2,
      textColor: textDark,
      lineColor: lineLight,
      lineWidth: 0.15,
      cellPadding: 3,
      valign: 'top',
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', textColor: textMuted },
      1: { cellWidth: 80 }, // Wide enough for long multiline product descriptions
      2: { cellWidth: 14, halign: 'right' },
      3: { cellWidth: 26, halign: 'right' },
      4: { cellWidth: 22, halign: 'right', textColor: greenDiscount },
      5: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
  });

  // Position after table
  cursorY = (doc as any).lastAutoTable.finalY + 6;

  // ─────────────────────────────────────────────────────────────
  // 4. TOTALS BLOCK & NOTES
  // ─────────────────────────────────────────────────────────────
  const totalsBoxWidth = 84;
  const totalsBoxX = rightX - totalsBoxWidth;
  const estimatedTotalsHeight = 44 + (totals.additionalCharges > 0 ? 6 : 0) + (quotation.tax.enabled ? 6 : 0);

  // If not enough room for totals, create a new page cleanly
  if (cursorY + estimatedTotalsHeight > bottomThreshold) {
    doc.addPage();
    cursorY = 20;
  }

  // Draw Totals Box
  const totalsStartY = cursorY;
  let tRowY = totalsStartY;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);
  doc.text('Subtotal:', totalsBoxX + 2, tRowY);
  doc.setTextColor(...textDark);
  doc.text(formatPdfCurrency(totals.subtotal, quotation.currency), rightX - 2, tRowY, { align: 'right' });
  tRowY += 5.2;

  // Item discounts
  if (totals.itemDiscounts > 0) {
    doc.setTextColor(...textMuted);
    doc.text('Item Discounts:', totalsBoxX + 2, tRowY);
    doc.setTextColor(...greenDiscount);
    doc.text(`-${formatPdfCurrency(totals.itemDiscounts, quotation.currency)}`, rightX - 2, tRowY, { align: 'right' });
    tRowY += 5.2;
  }

  // Quotation Discount
  if (totals.documentDiscount > 0) {
    const discLabel =
      quotation.documentDiscount.type === 'percent'
        ? `Discount (${quotation.documentDiscount.value}%):`
        : 'Quotation Discount:';
    doc.setTextColor(...textMuted);
    doc.text(discLabel, totalsBoxX + 2, tRowY);
    doc.setTextColor(...greenDiscount);
    doc.text(`-${formatPdfCurrency(totals.documentDiscount, quotation.currency)}`, rightX - 2, tRowY, { align: 'right' });
    tRowY += 5.2;
  }

  // Tax
  if (quotation.tax.enabled) {
    const taxLabel = `${quotation.tax.name || 'Tax'} (${quotation.tax.rate}%${quotation.tax.inclusive ? ' incl.' : ''}):`;
    doc.setTextColor(...textMuted);
    doc.text(taxLabel, totalsBoxX + 2, tRowY);
    doc.setTextColor(...textDark);
    doc.text(formatPdfCurrency(totals.tax, quotation.currency), rightX - 2, tRowY, { align: 'right' });
    tRowY += 5.2;
  }

  // Additional Charges
  if (totals.additionalCharges > 0) {
    const addLabel = `${quotation.additionalChargesLabel || 'Additional charges'}:`;
    doc.setTextColor(...textMuted);
    doc.text(addLabel, totalsBoxX + 2, tRowY);
    doc.setTextColor(...textDark);
    doc.text(`+${formatPdfCurrency(totals.additionalCharges, quotation.currency)}`, rightX - 2, tRowY, { align: 'right' });
    tRowY += 5.2;
  }

  // Grand Total Card
  tRowY += 1;
  doc.setFillColor(...navy);
  doc.rect(totalsBoxX, tRowY, totalsBoxWidth, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`TOTAL (${quotation.currency}):`, totalsBoxX + 4, tRowY + 6.5);

  doc.setFontSize(11);
  doc.text(formatPdfCurrency(totals.total, quotation.currency), rightX - 4, tRowY + 6.5, { align: 'right' });

  // Update cursor below totals box
  cursorY = tRowY + 16;

  // ─────────────────────────────────────────────────────────────
  // 5. TERMS, PAYMENT, & NOTES
  // ─────────────────────────────────────────────────────────────
  const hasNotes =
    Boolean(quotation.paymentTerms) ||
    Boolean(quotation.deliveryInfo) ||
    Boolean(quotation.notes) ||
    Boolean(quotation.terms);

  if (hasNotes) {
    // Check if we need a page break before notes
    if (cursorY + 36 > bottomThreshold) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...teal);
    doc.text('TERMS & CONDITIONS / NOTES', leftMargin, cursorY);
    cursorY += 4.5;

    const notesWidth = printableWidth;

    if (quotation.paymentTerms) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(...textDark);
      doc.text('Payment Terms:', leftMargin, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      const split = doc.splitTextToSize(quotation.paymentTerms, notesWidth - 30);
      doc.text(split, leftMargin + 26, cursorY);
      cursorY += split.length * 4.2 + 2;
    }

    if (quotation.deliveryInfo) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(...textDark);
      doc.text('Delivery & Completion:', leftMargin, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      const split = doc.splitTextToSize(quotation.deliveryInfo, notesWidth - 38);
      doc.text(split, leftMargin + 34, cursorY);
      cursorY += split.length * 4.2 + 2;
    }

    if (quotation.notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(...textDark);
      doc.text('Notes:', leftMargin, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      const split = doc.splitTextToSize(quotation.notes, notesWidth - 16);
      doc.text(split, leftMargin + 14, cursorY);
      cursorY += split.length * 4.2 + 2;
    }

    if (quotation.terms) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(...textDark);
      doc.text('Terms:', leftMargin, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      const split = doc.splitTextToSize(quotation.terms, notesWidth - 16);
      doc.text(split, leftMargin + 14, cursorY);
      cursorY += split.length * 4.2 + 2;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 6. AUTHORIZED SIGNATURE AREA (IF REQUESTED)
  // ─────────────────────────────────────────────────────────────
  if (quotation.showSignature !== false) {
    if (cursorY + 34 > bottomThreshold) {
      doc.addPage();
      cursorY = 24;
    } else {
      cursorY += 6;
    }

    const sigBoxW = (printableWidth - 20) / 2;
    const sig1X = leftMargin;
    const sig2X = leftMargin + sigBoxW + 20;

    // Line 1: Business signature
    doc.setDrawColor(...textMuted);
    doc.setLineWidth(0.3);
    doc.line(sig1X, cursorY + 14, sig1X + sigBoxW, cursorY + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(...textDark);
    doc.text(quotation.signatureTitle || 'Authorized Signature', sig1X, cursorY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text(`For ${senderName}`, sig1X, cursorY + 23);

    // Line 2: Client acceptance
    doc.line(sig2X, cursorY + 14, sig2X + sigBoxW, cursorY + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(...textDark);
    doc.text('Client Acceptance & Date', sig2X, cursorY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text(`Accepted by ${customerName}`, sig2X, cursorY + 23);
  }

  // ─────────────────────────────────────────────────────────────
  // 7. FOOTER & DYNAMIC PAGINATION (PAGE X OF Y)
  // ─────────────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    doc.setPage(pageNum);

    // Footer divider line
    doc.setDrawColor(...lineLight);
    doc.setLineWidth(0.25);
    doc.line(leftMargin, 287, rightX, 287);

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(...textMuted);
    doc.text(
      'This is a quotation only, not a tax invoice or receipt. Prices are subject to stated validity terms.',
      leftMargin,
      291,
    );

    // Page X of Y
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...textDark);
    doc.text(`Page ${pageNum} of ${totalPages}`, rightX, 291, { align: 'right' });
  }

  return doc;
}

/**
 * Downloads the quotation as an A4 PDF document.
 */
export async function downloadQuotationPdf(
  quotation: Quotation,
  totals: QuotationTotals,
  fileName?: string,
): Promise<void> {
  const doc = await generateQuotationPdf(quotation, totals);
  const saveName = fileName || `${quotation.number || 'quotation'}.pdf`;
  doc.save(saveName);
}

/**
 * Triggers native browser print with @media print CSS styles.
 */
export function printElement(): void {
  window.print();
}
