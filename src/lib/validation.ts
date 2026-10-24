import type { FieldErrors, Quotation } from '../types/quotation';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isFilled(value: string): boolean {
  return value.trim().length > 0;
}

export function validateQuotation(quotation: Quotation): FieldErrors {
  const errors: FieldErrors = {};

  if (!isFilled(quotation.business.name)) {
    errors['business.name'] = 'Enter your business or sender name.';
  }
  if (quotation.business.email && !EMAIL_PATTERN.test(quotation.business.email.trim())) {
    errors['business.email'] = 'Enter a valid business email, or leave this optional field blank.';
  }

  if (!isFilled(quotation.customer.name) && !isFilled(quotation.customer.company)) {
    errors['customer.name'] = 'Enter a customer name or company.';
  }
  if (quotation.customer.email && !EMAIL_PATTERN.test(quotation.customer.email.trim())) {
    errors['customer.email'] = 'Enter a valid customer email, or leave this optional field blank.';
  }

  if (!quotation.number.trim()) {
    errors.number = 'A quotation number is required.';
  }
  if (!quotation.date) {
    errors.date = 'Select a quotation date.';
  }
  if (quotation.validUntil && quotation.date && quotation.validUntil < quotation.date) {
    errors.validUntil = 'Validity date cannot be before the quotation date.';
  }

  const filledItems = quotation.items.filter((item) => isFilled(item.description));
  if (filledItems.length === 0) {
    errors.items = 'Add at least one item with a description.';
  }

  quotation.items.forEach((item, index) => {
    const hasAny =
      isFilled(item.description) || item.quantity !== 1 || item.unitPrice > 0 || item.discountValue > 0;
    if (!hasAny) return;
    if (!isFilled(item.description)) {
      errors[`items.${index}.description`] = 'Describe this item.';
    }
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
      errors[`items.${index}.quantity`] = 'Quantity must be greater than 0.';
    }
    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
      errors[`items.${index}.unitPrice`] = 'Unit price cannot be negative.';
    }
    if (item.discountType === 'percent' && (item.discountValue < 0 || item.discountValue > 100)) {
      errors[`items.${index}.discountValue`] = 'Item discount percent must be between 0 and 100.';
    }
    if (item.discountType === 'amount' && item.discountValue < 0) {
      errors[`items.${index}.discountValue`] = 'Item discount cannot be negative.';
    }
  });

  if (quotation.tax.enabled) {
    if (!quotation.tax.name.trim()) {
      errors['tax.name'] = 'Enter a tax label, such as VAT.';
    }
    if (!Number.isFinite(quotation.tax.rate) || quotation.tax.rate < 0 || quotation.tax.rate > 100) {
      errors['tax.rate'] = 'Tax rate must be between 0 and 100.';
    }
  }

  if (
    quotation.documentDiscount.type === 'percent' &&
    (quotation.documentDiscount.value < 0 || quotation.documentDiscount.value > 100)
  ) {
    errors['documentDiscount.value'] = 'Document discount percent must be between 0 and 100.';
  }
  if (quotation.documentDiscount.type === 'amount' && quotation.documentDiscount.value < 0) {
    errors['documentDiscount.value'] = 'Document discount cannot be negative.';
  }

  return errors;
}

export function firstErrorMessage(errors: FieldErrors): string | null {
  const first = Object.values(errors)[0];
  return first ?? null;
}
