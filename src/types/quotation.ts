export type DiscountType = 'none' | 'percent' | 'amount';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountType: DiscountType;
  discountValue: number;
}

export interface PartyDetails {
  name: string;
  company: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logoDataUrl: string | null;
}

export interface CustomerDetails {
  name: string;
  company: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface TaxConfig {
  enabled: boolean;
  name: string;
  rate: number;
  inclusive: boolean;
}

export interface DocumentDiscount {
  type: DiscountType;
  value: number;
}

export interface Quotation {
  id: string;
  number: string;
  date: string;
  validUntil: string;
  currency: string;
  projectReference?: string;
  business: PartyDetails;
  customer: CustomerDetails;
  items: LineItem[];
  tax: TaxConfig;
  documentDiscount: DocumentDiscount;
  additionalCharges?: number;
  additionalChargesLabel?: string;
  paymentTerms: string;
  deliveryInfo: string;
  notes: string;
  terms: string;
  showSignature?: boolean;
  signatureTitle?: string;
  updatedAt: string;
}

export interface LineTotals {
  id: string;
  gross: number;
  discount: number;
  net: number;
}

export interface QuotationTotals {
  lines: LineTotals[];
  itemsGross: number;
  itemDiscounts: number;
  subtotal: number;
  documentDiscount: number;
  taxable: number;
  tax: number;
  additionalCharges: number;
  total: number;
}

export type FieldErrors = Record<string, string>;
