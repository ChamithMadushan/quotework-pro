import fs from 'node:fs';
import path from 'node:path';
import { generateQuotationPdf } from '../src/lib/pdf';
import { calculateTotals } from '../src/lib/calculations';
import type { Quotation } from '../src/types/quotation';

async function generateSample() {
  const quote: Quotation = {
    id: 'quote-sample-01',
    number: 'QT-20261024-8841',
    date: '2026-10-24',
    validUntil: '2026-11-07',
    currency: 'LKR',
    business: {
      name: 'Apex Smart Solutions (Pvt) Ltd',
      company: 'Apex Technologies',
      address: 'No. 142/A, Galle Road, Bambalapitiya',
      city: 'Colombo 04, Sri Lanka',
      phone: '+94 11 258 9632 / +94 77 712 3456',
      email: 'info@apexsmart.lk',
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
        id: 'item-1',
        description: 'Hikvision 16-Channel 4K AcuSense NVR (DS-7616NXI-K2) with 4TB Western Digital Purple Surveillance HDD',
        quantity: 1,
        unitPrice: 115000,
        discountType: 'percent',
        discountValue: 5,
      },
      {
        id: 'item-2',
        description: 'Hikvision 5MP Outdoor IR Network Turret IP Cameras with DarkFighter low-light sensor and IP67 weather resistance',
        quantity: 8,
        unitPrice: 16500,
        discountType: 'none',
        discountValue: 0,
      },
      {
        id: 'item-3',
        description: 'Schneider Electric Cat6 UTP 305m Cable Box + Heavy Duty PVC Conduit Casing & Accessories',
        quantity: 2,
        unitPrice: 38500,
        discountType: 'none',
        discountValue: 0,
      },
      {
        id: 'item-4',
        description: 'Professional System Installation, Cable Pulling, Channel Configuration, and Remote Mobile App Setup',
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

  const totals = calculateTotals(quote);
  const pdfDoc = await generateQuotationPdf(quote, totals);
  
  // Output as ArrayBuffer and write to file
  const arrayBuffer = pdfDoc.output('arraybuffer');
  const buffer = Buffer.from(arrayBuffer);
  
  const outputPath = path.resolve(process.cwd(), 'Sample_Quotation_LKR.pdf');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Sample PDF generated successfully at: ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

generateSample().catch(console.error);
