import type { LineItem, Quotation, QuotationTotals } from '../types/quotation';
import { clampNonNegative, fromCents, toCents } from './money';

function lineGrossCents(item: LineItem): number {
  const qty = clampNonNegative(item.quantity);
  const price = clampNonNegative(item.unitPrice);
  return toCents(qty * price);
}

function lineDiscountCents(item: LineItem, grossCents: number): number {
  const value = clampNonNegative(item.discountValue);
  if (item.discountType === 'none' || value === 0) return 0;
  if (item.discountType === 'percent') {
    const pct = Math.min(value, 100);
    return Math.round((grossCents * pct) / 100);
  }
  return Math.min(toCents(value), grossCents);
}

export function calculateTotals(quotation: Quotation): QuotationTotals {
  const lines = quotation.items.map((item) => {
    const grossCents = lineGrossCents(item);
    const discountCents = lineDiscountCents(item, grossCents);
    const netCents = grossCents - discountCents;
    return {
      id: item.id,
      gross: fromCents(grossCents),
      discount: fromCents(discountCents),
      net: fromCents(netCents),
      netCents,
    };
  });

  const itemsGrossCents = lines.reduce((sum, line) => sum + toCents(line.gross), 0);
  const itemDiscountsCents = lines.reduce((sum, line) => sum + toCents(line.discount), 0);
  const subtotalCents = lines.reduce((sum, line) => sum + line.netCents, 0);

  const doc = quotation.documentDiscount;
  let documentDiscountCents = 0;
  if (doc.type === 'percent') {
    const pct = Math.min(clampNonNegative(doc.value), 100);
    documentDiscountCents = Math.round((subtotalCents * pct) / 100);
  } else if (doc.type === 'amount') {
    documentDiscountCents = Math.min(toCents(clampNonNegative(doc.value)), subtotalCents);
  }

  const taxableCents = subtotalCents - documentDiscountCents;
  let taxCents = 0;
  if (quotation.tax.enabled && quotation.tax.rate > 0) {
    const rate = clampNonNegative(quotation.tax.rate);
    if (quotation.tax.inclusive) {
      taxCents = Math.round((taxableCents * rate) / (100 + rate));
    } else {
      taxCents = Math.round((taxableCents * rate) / 100);
    }
  }

  const additionalChargesCents = toCents(clampNonNegative(quotation.additionalCharges ?? 0));

  const totalCents =
    (quotation.tax.enabled && quotation.tax.inclusive
      ? taxableCents
      : taxableCents + taxCents) + additionalChargesCents;

  return {
    lines: lines.map(({ id, gross, discount, net }) => ({ id, gross, discount, net })),
    itemsGross: fromCents(itemsGrossCents),
    itemDiscounts: fromCents(itemDiscountsCents),
    subtotal: fromCents(subtotalCents),
    documentDiscount: fromCents(documentDiscountCents),
    taxable: fromCents(taxableCents),
    tax: fromCents(taxCents),
    additionalCharges: fromCents(additionalChargesCents),
    total: fromCents(totalCents),
  };
}
