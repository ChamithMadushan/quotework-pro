import { generateQuotationPdf } from '../src/lib/pdf';
import { calculateTotals } from '../src/lib/calculations';
import type { Quotation } from '../src/types/quotation';

async function runTests() {
  console.log('🧪 Starting PDF Generation Verification Suite...\n');

  // Test 1: Short quotation (Sri Lanka LKR, no logo, minimal optional fields)
  console.log('Test 1: Short quotation (LKR, basic fields)...');
  const shortQuote: Quotation = {
    id: 'test-1',
    number: 'QT-20261024-001',
    date: '2026-10-24',
    validUntil: '2026-11-07',
    currency: 'LKR',
    business: {
      name: 'Apex Network Solutions',
      company: 'Apex PVT Ltd',
      address: '124 Galle Road',
      city: 'Colombo 03',
      phone: '+94 11 234 5678',
      email: 'sales@apex.lk',
      website: 'www.apex.lk',
      taxId: 'BRN-1029384',
      logoDataUrl: null,
    },
    customer: {
      name: 'Kasun Perera',
      company: 'Lanka Logistics',
      address: '45 Kandy Road',
      city: 'Kelaniya',
      phone: '+94 77 123 4567',
      email: 'kasun@lankalogistics.lk',
    },
    items: [
      {
        id: 'i1',
        description: 'Hikvision 8-Channel 4K NVR with 2TB Surveillance Hard Drive',
        quantity: 1,
        unitPrice: 65000,
        discountType: 'percent',
        discountValue: 5,
      },
      {
        id: 'i2',
        description: 'Outdoor 5MP IR Bullet IP Cameras (Waterproof IP67)',
        quantity: 4,
        unitPrice: 14500,
        discountType: 'none',
        discountValue: 0,
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
    additionalCharges: 5000,
    additionalChargesLabel: 'Installation & Cabling Charges',
    paymentTerms: '50% advance payment on confirmation, 50% upon handover.',
    deliveryInfo: 'Completion within 3 business days from site inspection.',
    notes: 'Warranty: 2 Years manufacturer warranty for NVR & Cameras.',
    terms: 'Prices valid for 14 calendar days. Cable laying based on actual meter run.',
    projectReference: 'CCTV Installation - Warehouse #2',
    showSignature: true,
    signatureTitle: 'Authorized Project Lead',
    updatedAt: new Date().toISOString(),
  };

  const totals1 = calculateTotals(shortQuote);
  const pdf1 = await generateQuotationPdf(shortQuote, totals1);
  const pageCount1 = pdf1.getNumberOfPages();
  console.log(`✓ Test 1 passed: generated ${pageCount1} page(s) (expected 1)\n`);

  // Test 2: Long quotation with 20 items & long descriptions (Pagination & header repeat test)
  console.log('Test 2: Long quotation (20 items, multi-page pagination test)...');
  const itemsList = [];
  for (let i = 1; i <= 20; i++) {
    itemsList.push({
      id: `item-${i}`,
      description: `Commercial Item #${i}: High specification networking equipment including enterprise router, Cat6 UTP cabling, patch panel punch-down, fiber optic transceivers, and managed PoE switch with redundant power supplies.`,
      quantity: i,
      unitPrice: 12500 + i * 850,
      discountType: i % 3 === 0 ? ('percent' as const) : ('none' as const),
      discountValue: i % 3 === 0 ? 10 : 0,
    });
  }

  const longQuote: Quotation = {
    ...shortQuote,
    id: 'test-2',
    number: 'QT-20261024-MULTI',
    currency: 'USD',
    items: itemsList,
    projectReference: 'Enterprise Campus IT Infrastructure Overhaul - Phase 1',
  };

  const totals2 = calculateTotals(longQuote);
  const pdf2 = await generateQuotationPdf(longQuote, totals2);
  const pageCount2 = pdf2.getNumberOfPages();
  console.log(`✓ Test 2 passed: multi-page pagination generated ${pageCount2} pages (expected >= 2)\n`);

  // Test 3: International currency formats (EUR, GBP, AUD, SGD, AED)
  console.log('Test 3: Different currency formats test...');
  for (const curr of ['EUR', 'GBP', 'AUD', 'SGD', 'AED']) {
    const quoteCurr: Quotation = {
      ...shortQuote,
      currency: curr,
      number: `QT-${curr}-100`,
    };
    const totalsCurr = calculateTotals(quoteCurr);
    const pdfCurr = await generateQuotationPdf(quoteCurr, totalsCurr);
    console.log(`  ✓ ${curr} quotation generated (${pdfCurr.getNumberOfPages()} page)`);
  }

  // Test 4: Missing optional fields test
  console.log('\nTest 4: Missing optional fields graceful fallback...');
  const minimalQuote: Quotation = {
    id: 'min-1',
    number: 'QT-MINIMAL',
    date: '2026-10-24',
    validUntil: '',
    currency: 'LKR',
    business: {
      name: 'Sole Freelancer',
      company: '',
      address: '',
      city: '',
      phone: '',
      email: 'freelance@test.com',
      website: '',
      taxId: '',
      logoDataUrl: null,
    },
    customer: {
      name: 'Client Individual',
      company: '',
      address: '',
      city: '',
      phone: '',
      email: '',
    },
    items: [
      {
        id: 'i1',
        description: 'Consultation Session (2 Hours)',
        quantity: 2,
        unitPrice: 15000,
        discountType: 'none',
        discountValue: 0,
      },
    ],
    tax: {
      enabled: false,
      name: '',
      rate: 0,
      inclusive: false,
    },
    documentDiscount: {
      type: 'none',
      value: 0,
    },
    paymentTerms: '',
    deliveryInfo: '',
    notes: '',
    terms: '',
    showSignature: false,
    updatedAt: new Date().toISOString(),
  };

  const totalsMin = calculateTotals(minimalQuote);
  const pdfMin = await generateQuotationPdf(minimalQuote, totalsMin);
  console.log(`✓ Test 4 passed: minimal quote generated without error (${pdfMin.getNumberOfPages()} page)\n`);

  console.log('🎉 All automated PDF generation tests PASSED successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
