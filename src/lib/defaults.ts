import type { LineItem, Quotation } from '../types/quotation';
import { DEFAULT_CURRENCY } from './currency';
import { addDaysIso, createId, createQuotationNumber, todayIsoDate } from './ids';

export const DEFAULT_TERMS = `This quotation is an offer to supply the listed goods or services at the stated prices. Prices are valid until the expiry date. This document is not a tax invoice. Confirm tax treatment with a qualified advisor before issuing invoices or collecting tax.`;

export function createEmptyItem(): LineItem {
  return {
    id: createId('item'),
    description: '',
    quantity: 1,
    unitPrice: 0,
    discountType: 'none',
    discountValue: 0,
  };
}

export function createEmptyQuotation(): Quotation {
  const date = todayIsoDate();
  return {
    id: createId('quote'),
    number: createQuotationNumber(),
    date,
    validUntil: addDaysIso(date, 14),
    currency: DEFAULT_CURRENCY,
    business: {
      name: '',
      company: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      website: '',
      taxId: '',
      logoDataUrl: null,
    },
    customer: {
      name: '',
      company: '',
      address: '',
      city: '',
      phone: '',
      email: '',
    },
    items: [createEmptyItem()],
    tax: {
      enabled: false,
      name: 'VAT',
      rate: 18,
      inclusive: false,
    },
    documentDiscount: {
      type: 'none',
      value: 0,
    },
    additionalCharges: 0,
    additionalChargesLabel: 'Additional charges / Delivery',
    paymentTerms: '',
    deliveryInfo: '',
    notes: '',
    terms: DEFAULT_TERMS,
    projectReference: '',
    showSignature: true,
    signatureTitle: 'Authorized Signature',
    updatedAt: new Date().toISOString(),
  };
}

export function createSampleQuotation(): Quotation {
  const date = todayIsoDate();
  return {
    id: createId('quote'),
    number: createQuotationNumber(),
    date,
    validUntil: addDaysIso(date, 14),
    currency: DEFAULT_CURRENCY,
    business: {
      name: 'Apex Smart Solutions (Pvt) Ltd',
      company: 'Apex Technologies',
      address: 'No. 142/A, Galle Road, Bambalapitiya',
      city: 'Colombo 04, Sri Lanka',
      phone: '+94 11 258 9632 / +94 77 712 3456',
      email: 'sales@apexsmart.lk',
      website: 'www.apexsmart.lk',
      taxId: 'PV-00284719 / VAT 1029384-7000',
      logoDataUrl: null,
    },
    customer: {
      name: 'Mr. Rohan Gunaratne',
      company: 'Highland Logistics International',
      address: 'Level 4, Orion City Park, Dr. Danister De Silva Mawatha',
      city: 'Colombo 09, Sri Lanka',
      phone: '+94 71 889 2341',
      email: 'rohan.g@highlandlogistics.com',
    },
    projectReference: 'Commercial Warehouse CCTV & Access Control Upgrade',
    items: [
      {
        id: createId('item'),
        description: 'Hikvision 16-Channel 4K AcuSense NVR (DS-7616NXI-K2) with 4TB Surveillance HDD',
        quantity: 1,
        unitPrice: 115000,
        discountType: 'percent',
        discountValue: 5,
      },
      {
        id: createId('item'),
        description: 'Hikvision 5MP Outdoor IR Network Turret IP Cameras (Waterproof IP67)',
        quantity: 8,
        unitPrice: 16500,
        discountType: 'none',
        discountValue: 0,
      },
      {
        id: createId('item'),
        description: 'Schneider Electric Cat6 UTP 305m Cable Box + Heavy Duty PVC Conduit Casing',
        quantity: 2,
        unitPrice: 38500,
        discountType: 'none',
        discountValue: 0,
      },
      {
        id: createId('item'),
        description: 'Professional System Installation, Cable Pulling, Channel Configuration & Mobile App Setup',
        quantity: 1,
        unitPrice: 35000,
        discountType: 'amount',
        discountValue: 5000,
      },
    ],
    tax: {
      enabled: true,
      name: 'VAT',
      rate: 18,
      inclusive: false,
    },
    documentDiscount: {
      type: 'percent',
      value: 2,
    },
    additionalCharges: 7500,
    additionalChargesLabel: 'Express Transport & Testing Certification',
    paymentTerms: '50% advance confirmation deposit, 50% upon successful testing and handover.',
    deliveryInfo: 'On-site installation completed within 4 working days of mobilization.',
    notes: 'Includes 2 Years comprehensive hardware warranty for NVR & Cameras, 1 Year free on-site service support.',
    terms: 'Prices valid for 14 calendar days from the date of issue. Additional cabling beyond standard conduit will be invoiced on actual meter measurement.',
    showSignature: true,
    signatureTitle: 'Authorized Systems Engineer',
    updatedAt: new Date().toISOString(),
  };
}
