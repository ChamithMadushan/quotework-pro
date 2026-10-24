export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
}

export type GuideCategory = 'Fundamentals' | 'Sri Lanka Compliance' | 'Finance & Tax' | 'B2B & Trade';

export interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  metaDescription: string;
  category: GuideCategory;
  readTime: string;
  publishedDate: string;
  updatedDate: string;
  author: string;
  keyTakeaways: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedSlugs: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-create-a-professional-quotation',
    title: 'How to Create a Professional Quotation: A Step-by-Step Business Guide',
    subtitle: 'From itemized breakdown to legal disclaimers, master the anatomy of a quotation that wins client trust.',
    metaDescription: 'Step-by-step guide on how to create a professional business quotation. Discover essential fields, pricing structures, validity periods, and formatting tips.',
    category: 'Fundamentals',
    readTime: '6 min read',
    publishedDate: '2026-10-15',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro Editorial Team',
    keyTakeaways: [
      'A quotation is a formal offer to supply goods or services at fixed prices within a specified validity period.',
      'Always include sender BRN/Tax IDs, client billing details, and a unique sequential quote number.',
      'Clearly distinguish line-item discounts from overall document discounts to protect profit margins.',
      'Never omit validity dates — price volatility in raw materials and currency changes can otherwise cause major losses.',
    ],
    sections: [
      {
        id: 'anatomy',
        title: '1. The Core Anatomy of a Professional Quotation',
        content: `A quotation is often the first formal document a prospective client reviews before committing their budget. A sloppy spreadsheet or informal WhatsApp text immediately raises doubts about your operational reliability.

A complete quotation consists of five structural zones:
- **Header & Branding**: Business logo, official registered name, contact phone, business email, website, and business registration (BRN) or Tax ID.
- **Client & Reference Metadata**: Client contact person, company name, delivery/site address, quotation issue date, unique reference number (e.g., QT-20261024-001), and project reference title.
- **Itemized Table**: Individual line items with detailed scope descriptions, unit quantities, unit prices, applicable line discounts, and net row totals.
- **Financial Summary Block**: Clear progression from Subtotal → Item Discounts → Overall Document Discount → Tax (e.g. VAT/SSCL) → Additional Charges (delivery/installation) → Grand Total.
- **Terms & Sign-Off**: Payment terms, delivery timelines, validity period, and authorized signature lines.`,
      },
      {
        id: 'descriptions',
        title: '2. Writing Clear, Unambiguous Item Descriptions',
        content: `The most common dispute between suppliers and customers stems from vague line items. For example, writing *"CCTV installation — 1 unit — Rs. 150,000"* invites conflict if the client expects 16 cameras while the supplier budgeted for 4.

**Bad description**:
- *Network switch & cabling — Rs. 85,000*

**Professional description**:
- *MikroTik Cloud Router Switch 24-Port Gigabit (CRS326-24G-2S+RM) with rackmount ears, 2x 305m Schneider Cat6 UTP cabling, patch panel punch-down, and labeling.*

By itemizing brands, model numbers, and specific deliverables, you protect your scope of work and demonstrate thorough technical competence.`,
      },
      {
        id: 'validity',
        title: '3. Why Validity Periods Are Non-Negotiable',
        content: `Every quote must specify an expiration date (typically 14 to 30 days). In fluctuating economic climates with shifting exchange rates and inflation, quotes without expiry dates are a legal and financial liability.

If an unexpired quote is accepted 6 months later when wholesale hardware prices have surged 25%, you may be legally compelled or ethically pressured to honor loss-making pricing.

QuoteWork Pro automatically defaults quotes to a 14-day validity period, which you can customize based on your industry volatility.`,
      },
      {
        id: 'digital-generation',
        title: '4. Moving Beyond Clunky Spreadsheets to Instant A4 PDFs',
        content: `While Excel and Google Sheets are versatile for arithmetic, exporting them to PDF frequently results in clipped tables, awkward page breaks, and broken font layouts on mobile devices.

Using an online quotation builder like QuoteWork Pro ensures:
- Exact A4 portrait standard dimensions (210mm × 297mm).
- Automatic table pagination that prevents table rows from cutting in half across pages.
- Client-side data storage so proprietary trade pricing is never shared with third-party servers.
- Consistent branding and corporate presentation across all sales representatives.`,
      },
    ],
    faqs: [
      {
        question: 'What is the standard validity period for a quotation?',
        answer: 'Standard validity periods range between 14 to 30 days. For commodities or hardware subject to rapid foreign exchange fluctuation, businesses often set 7 to 14 days.',
      },
      {
        question: 'Is a quotation a legally binding contract?',
        answer: 'When a quotation is signed or formally accepted by the customer within its validity period, it generally forms a legally binding agreement under commercial contract law.',
      },
      {
        question: 'Should I include tax on my quotation?',
        answer: 'Yes, if your business is registered for VAT or local sales taxes. Always state clearly whether line items are tax-inclusive or tax-exclusive.',
      },
    ],
    relatedSlugs: ['quotation-format-sri-lanka', 'quotation-vs-invoice', 'quotation-terms-and-conditions'],
  },
  {
    slug: 'quotation-format-sri-lanka',
    title: 'Quotation Format for Sri Lankan Businesses: Best Practices & LKR Compliance',
    subtitle: 'Everything small businesses, contractors, and IT suppliers in Sri Lanka need to know about preparing compliant LKR quotations.',
    metaDescription: 'Essential quotation format guide for Sri Lanka businesses. Learn how to handle VAT (18%), SSCL, Business Registration Numbers (BRN), and LKR payment terms.',
    category: 'Sri Lanka Compliance',
    readTime: '7 min read',
    publishedDate: '2026-10-18',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro Sri Lanka Desk',
    keyTakeaways: [
      'Sri Lankan quotations must clearly display the currency as LKR (Rs.) to avoid ambiguity with USD contracts.',
      'Include your Business Registration Number (PV / W / W.A / BRN) and VAT registration number if registered.',
      'Value Added Tax (VAT) in Sri Lanka is currently 18%; Social Security Contribution Levy (SSCL) is 2.5%.',
      'The Inland Revenue Department (IRD) strictly differentiates between commercial quotations and Tax Invoices.',
    ],
    sections: [
      {
        id: 'sl-essentials',
        title: '1. Key Elements of a Sri Lankan Business Quotation',
        content: `Operating a business in Sri Lanka—whether as an individual contractor, sole proprietorship, or private limited company (Pvt Ltd)—requires structured documentation when dealing with corporate clients, government tenders, or overseas buyers.

Your quotation should include:
- **Registered Entity Name**: As shown on your Form 1 (Companies Act No. 7 of 2007) or Provincial Business Names certificate.
- **Registration Identifiers**: Your PV registration number (e.g. PV-00284719) and Tax Identification Number (TIN).
- **Physical Address**: An authentic registered address builds trust with procurement officers in Colombo, Kandy, Galle, and across the island.
- **Bank Wire Instructions**: Commercial Bank, Sampath Bank, Hatton National Bank (HNB), or BOC account details for direct SLIPS or CEFT transfers.`,
      },
      {
        id: 'vat-sscl',
        title: '2. Handling VAT (18%) and SSCL (2.5%) Accurately',
        content: `Sri Lanka increased its standard VAT rate to 18%. Additionally, eligible enterprises above turnover thresholds must account for the Social Security Contribution Levy (SSCL) at 2.5%.

When issuing quotations in Sri Lanka:
- **Non-VAT Registered Businesses**: State your total in LKR without adding tax. Do not state *"VAT 0%"* as this implies VAT registration. Simply omit the tax row.
- **VAT Registered Businesses**: Clearly separate the Net Taxable Subtotal from the 18% VAT amount. Specify whether prices are inclusive or exclusive of VAT.
- **Disclaimer**: Always include the note: *"This quotation is an offer to supply and not a tax invoice. A formal Tax Invoice will be issued upon delivery/payment."*`,
      },
      {
        id: 'lkr-currency',
        title: '3. Currency Formatting in LKR (Rs.)',
        content: `In Sri Lanka, currency is commonly represented as **LKR**, **Rs.**, or **රු**. In professional documents, using the international code **LKR** (e.g., *LKR 145,000.00*) prevents misinterpretation when dealing with international clients or dual-currency projects.

QuoteWork Pro defaults to LKR formatting with standard Sri Lankan conventions (two decimal places and thousands commas) while supporting integer-cents calculation to ensure mathematical precision down to the cent.`,
      },
      {
        id: 'payment-milestones',
        title: '4. Standard Payment Terms in the Sri Lankan Market',
        content: `Due to liquidity and cashflow dynamics in Sri Lanka, offering 100% credit or Net 60 days can strain small businesses. Common sustainable practices include:
- **Hardware & Retail Supply**: 50% advance confirmation deposit, 50% prior to dispatch or on delivery.
- **Contractors & Installation**: 40% mobilization advance, 40% on stage completion, 20% on handover testing.
- **IT & Consulting**: 30% project kickoff, 40% mid-point demo, 30% deployment.`,
      },
    ],
    faqs: [
      {
        question: 'Do I need a VAT number to send a quotation in Sri Lanka?',
        answer: 'No. Any registered business or sole proprietor can issue quotations. You only need to include a VAT number if your business is officially registered for VAT with the Inland Revenue Department (IRD).',
      },
      {
        question: 'Can I quote in USD for a client inside Sri Lanka?',
        answer: 'While pricing can be referenced to foreign exchange rates, local transactions are settled in Sri Lankan Rupees (LKR) in accordance with Central Bank of Sri Lanka (CBSL) foreign exchange regulations.',
      },
      {
        question: 'What is the difference between TIN and VAT numbers in Sri Lanka?',
        answer: 'A Taxpayer Identification Number (TIN) is a unique number issued to all registered individuals and corporate entities by the IRD. A VAT registration number is only assigned once an entity crosses the turnover threshold to collect and remit Value Added Tax.',
      },
    ],
    relatedSlugs: ['how-to-create-a-professional-quotation', 'quotation-vs-invoice', 'quotation-terms-and-conditions'],
  },
  {
    slug: 'quotation-vs-invoice',
    title: 'Quotation vs Invoice: Key Differences Every Business Owner Must Know',
    subtitle: 'Avoid legal and tax pitfalls by understanding when to issue a quotation, proforma invoice, and tax invoice.',
    metaDescription: 'Understand the legal, financial, and accounting differences between quotations and invoices. Learn when each document should be issued in your sales cycle.',
    category: 'Fundamentals',
    readTime: '5 min read',
    publishedDate: '2026-10-12',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro Finance Team',
    keyTakeaways: [
      'A quotation is an offer before work begins; an invoice is a demand for payment after an agreement is made.',
      'Quotations do not record revenue in accounting books and do not trigger tax liability.',
      'Invoices create accounts receivable/payable and are audited by tax authorities.',
      'Never send an invoice to pitch or negotiate prices—always start with a quotation.',
    ],
    sections: [
      {
        id: 'comparison-table',
        title: '1. Direct Comparison: Quotation vs. Invoice',
        content: `Confusing quotations and invoices can cause serious accounting problems, including accidental tax obligations on sales that never materialized.

| Feature | Quotation | Tax Invoice |
|---|---|---|
| **Purpose** | Estimate and commercial proposal | Formal demand for payment |
| **Timing** | Pre-sale negotiation stage | Post-sale or upon delivery milestone |
| **Accounting Entry** | None (does not affect books) | Records Accounts Receivable & Revenue |
| **Tax Impact** | No VAT/sales tax payable | Triggers VAT output tax liability |
| **Legal Status** | Non-binding until client accepts | Binding financial obligation |
| **Payment Request** | "Proposed cost" | "Amount due by [Date]" |`,
      },
      {
        id: 'proforma',
        title: '2. Where Does a Proforma Invoice Fit In?',
        content: `A **Proforma Invoice** is often used as a middle ground between a quotation and a tax invoice. It looks almost identical to an invoice, but carries the label *"Proforma"* and is typically issued when:
- Pre-payment is required before goods are manufactured or released.
- Goods are passing through customs and declare an estimated commercial value.
- An import/export letter of credit (LC) is being established with a bank.

Like a quotation, a proforma invoice does not create an official tax liability until converted into a final Tax Invoice.`,
      },
      {
        id: 'workflow',
        title: '3. The Recommended Sales Document Workflow',
        content: `To keep your business organized, follow this four-stage documentation pipeline:
1. **Inquiry / RFQ**: Customer requests pricing for products or services.
2. **Quotation**: You issue a formal QuoteWork Pro quotation with scope, unit pricing, discounts, and validity dates.
3. **Purchase Order (PO) / Acceptance**: Customer approves the quotation in writing or issues a PO.
4. **Tax Invoice**: You deliver the service/goods and issue a finalized Tax Invoice with payment instructions.`,
      },
    ],
    faqs: [
      {
        question: 'Can a customer pay against a quotation?',
        answer: 'While clients sometimes pay advance deposits based on quotation numbers, standard commercial practice requires issuing an invoice or formal receipt once funds are received.',
      },
      {
        question: 'Does issuing a quotation mean I owe tax to the government?',
        answer: 'No. A quotation carries zero tax liability. Tax liabilities are only triggered when a Tax Invoice is issued or payment is received.',
      },
    ],
    relatedSlugs: ['how-to-create-a-professional-quotation', 'quotation-terms-and-conditions', 'how-to-calculate-discounts-in-quotations'],
  },
  {
    slug: 'how-to-calculate-discounts-in-quotations',
    title: 'How to Calculate Discounts in a Quotation: Percentage vs Fixed Amount',
    subtitle: 'Master line-item vs overall discounts, preserve profit margins, and avoid floating-point math errors.',
    metaDescription: 'Complete guide on calculating discounts in quotations. Learn the difference between item-level discounts, document discounts, and tax impact.',
    category: 'Finance & Tax',
    readTime: '6 min read',
    publishedDate: '2026-10-14',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro Financial Engineering',
    keyTakeaways: [
      'Item discounts apply to specific goods; document discounts apply to the net subtotal of the entire quote.',
      'Discounts must be deducted BEFORE calculating output tax (VAT), not after.',
      'Small rounding errors in spreadsheet decimals can compound into mismatched balances on customer audits.',
      'QuoteWork Pro uses integer cents arithmetic to ensure 100% calculation integrity.',
    ],
    sections: [
      {
        id: 'discount-types',
        title: '1. Two Types of Quotation Discounts',
        content: `When offering price reductions to win deals, businesses typically utilize two distinct discounting mechanisms:

### A. Line-Item Discounts
Applied directly to a single product or service row. This is ideal when:
- Clearing specific aging inventory.
- Providing volume discounts on high-margin products while keeping low-margin accessories at full price.
- Can be configured as a percentage (e.g., 10% off) or a flat deduction (e.g., Rs. 5,000 off).

### B. Document-Level (Overall) Discounts
Applied to the overall net subtotal after line item amounts have been calculated. Useful for:
- Special customer promotions (e.g., "5% festive discount on total order").
- Commercial relationship goodwill discounts.`,
      },
      {
        id: 'calculation-order',
        title: '2. The Correct Mathematical Order of Operations',
        content: `Applying discounts in the wrong sequence can lead to tax compliance penalties or undercharging clients.

Here is the legally required progression:
1. **Gross Item Total** = Quantity × Unit Price
2. **Item Net** = Gross Item Total − Item Discount
3. **Subtotal** = Sum of all Item Nets
4. **Document Discount** = Calculated on Subtotal
5. **Taxable Amount** = Subtotal − Document Discount
6. **Tax (e.g. 18% VAT)** = Taxable Amount × Tax Rate
7. **Additional Charges** = Shipping, delivery, or crane fees (added after tax)
8. **Grand Total** = Taxable Amount + Tax + Additional Charges

> **Important**: Never calculate tax on the gross subtotal and then subtract the discount from the total. Tax is legally owed only on the discounted consideration received.`,
      },
      {
        id: 'cents-math',
        title: '3. Why Floating-Point Precision Matters in Software',
        content: `In web browsers, standard JavaScript numbers use IEEE 754 floating-point math, leading to infamous glitches like \`0.1 + 0.2 = 0.30000000000000004\`. When dealing with large enterprise quotations with tens of line items, fractional pennies can cause line totals not to add up to the grand total.

QuoteWork Pro converts all monetary values into **integer cents** before arithmetic, rounding intermediate steps safely, and only converting back to currency format for final rendering.`,
      },
    ],
    faqs: [
      {
        question: 'Should discount appear on the PDF quote?',
        answer: 'Yes. Transparently showing the regular unit price alongside the discount highlights the value you are offering the customer and builds appreciation for the savings.',
      },
      {
        question: 'Can I apply both an item discount and an overall discount?',
        answer: 'Yes. QuoteWork Pro supports applying item-level discounts to individual rows and then applying a document discount to the resulting subtotal.',
      },
    ],
    relatedSlugs: ['how-to-create-a-professional-quotation', 'quotation-format-sri-lanka', 'common-quotation-mistakes'],
  },
  {
    slug: 'supplier-quotation-format',
    title: 'How to Prepare a Supplier Quotation: Format, Lead Times & B2B Terms',
    subtitle: 'A practical guide for wholesalers, distributors, and hardware suppliers to draft winning B2B commercial proposals.',
    metaDescription: 'Comprehensive guide for suppliers, wholesalers, and hardware distributors. Format B2B quotations with MOQs, delivery schedules, and price stability terms.',
    category: 'B2B & Trade',
    readTime: '6 min read',
    publishedDate: '2026-10-19',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro Commercial Trade',
    keyTakeaways: [
      'B2B supplier quotations must explicitly state Minimum Order Quantities (MOQ) and packaging units.',
      'Lead times must state whether days are calendar days or business working days.',
      'Specify transport, offloading, and delivery point obligations clearly to prevent courier disputes.',
      'Include price adjustment terms for volatile imported goods affected by freight and exchange rates.',
    ],
    sections: [
      {
        id: 'b2b-structure',
        title: '1. What Corporate Buyers Expect from Suppliers',
        content: `When corporate purchasing teams and procurement managers evaluate vendor quotations, they rarely look only at the bottom-line price. They scrutinize delivery guarantees, warranty support, and clear trade conditions.

A winning supplier quotation highlights:
- **Part Numbers & SKUs**: Exact manufacturer code to confirm product parity.
- **Unit of Measure (UOM)**: Per meter, per box of 50, per drum, or per metric ton.
- **Minimum Order Quantities (MOQ)**: Pricing tiers based on volume commitments.
- **Stock Availability**: In stock vs. ex-factory import lead time.`,
      },
      {
        id: 'delivery-logistics',
        title: '2. Delivery & Transport Logistics Clauses',
        content: `Disputes frequently arise when goods arrive at a site and the truck driver expects the customer to have an unloader or forklift.

Always specify in your **Delivery Information** field:
- **Delivery Point**: CIF destination vs. Ex-Warehouse pickup.
- **Offloading Responsibility**: Stating whether the customer is responsible for labor and unloading.
- **Lead Time**: *"3 to 5 business days upon receipt of advance wire transfer and site readiness confirmation."*`,
      },
      {
        id: 'price-validity-clauses',
        title: '3. Managing Material & Freight Volatility',
        content: `If you supply copper cables, electrical switches, structural steel, or imported network chips, sea freight rates and global commodity indexes can swing dramatically.

Include a protective trade clause in your terms:
> *"Prices are based on prevailing exchange rates and import duties on the date of quotation. Orders confirmed after the validity period are subject to re-confirmation."*`,
      },
    ],
    faqs: [
      {
        question: 'What does "Lead Time" mean on a supplier quote?',
        answer: 'Lead time represents the total time required from the moment an order is confirmed (or deposit paid) until goods are delivered to the designated location.',
      },
      {
        question: 'How do I handle shipping charges on a quote?',
        answer: 'Use QuoteWork Pro\'s "Additional Charges" field to clearly display transport or delivery fees separately from product line items.',
      },
    ],
    relatedSlugs: ['how-to-create-a-professional-quotation', 'quotation-terms-and-conditions', 'how-to-create-a-quotation-pdf'],
  },
  {
    slug: 'quotation-terms-and-conditions',
    title: 'Quotation Terms and Conditions Explained: Essential Protective Clauses',
    subtitle: 'Protect your business from scope creep, late payments, and price fluctuations with clear terms and conditions.',
    metaDescription: 'Essential terms and conditions to include in business quotations. Learn how to draft payment schedules, warranty boundaries, and scope creep protections.',
    category: 'Fundamentals',
    readTime: '6 min read',
    publishedDate: '2026-10-16',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro Legal & Compliance',
    keyTakeaways: [
      'Terms and conditions prevent scope creep and eliminate ambiguities before money changes hands.',
      'Crucial clauses include validity expiration, payment milestones, and exclusions of scope.',
      'Include a clear non-invoice disclaimer to maintain regulatory and tax compliance.',
      'Sign-off lines transform accepted quotations into enforceable commercial agreements.',
    ],
    sections: [
      {
        id: 'crucial-clauses',
        title: '1. The 5 Essential Clauses Every Quote Needs',
        content: `Many small businesses neglect the terms and conditions section, leaving themselves vulnerable when clients change project requirements or delay payments.

Include these 5 fundamental clauses:
1. **Validity Clause**: *"This quotation is valid for 14 calendar days from the date of issue. Prices are subject to revision thereafter."*
2. **Payment Milestone Clause**: *"50% advance confirmation deposit required to initiate procurement; remaining 50% payable upon commissioning/handover."*
3. **Scope Exclusions**: Explicitly list what is NOT included (e.g., civil masonry work, government permit fees, trenching).
4. **Warranty & Liability Limits**: Specify manufacturer hardware warranty vs. workmanship warranty.
5. **Regulatory Disclaimer**: *"This document is a quotation only and does not constitute a tax invoice or receipt."*`,
      },
      {
        id: 'scope-creep',
        title: '2. Protecting Against Scope Creep',
        content: `Scope creep happens when clients request "just one small extra task" that wasn't budgeted.

Prevent this by including:
> *"Any additional work, material changes, or site alterations not explicitly listed in this quotation will be quoted separately as a variation order."*`,
      },
      {
        id: 'signatures',
        title: '3. Authorized Signatures and Digital Acceptance',
        content: `A quotation with a formal signature line gives prospective customers an immediate way to confirm their acceptance.

QuoteWork Pro includes a built-in toggle for an **Authorized Signature Section**, generating dual sign-off blocks on the A4 PDF for both your authorized representative and the client's acceptance.`,
      },
    ],
    faqs: [
      {
        question: 'Can I customize the terms on each quotation in QuoteWork Pro?',
        answer: 'Yes. QuoteWork Pro provides a default set of business terms which can be edited, expanded, or customized for each individual quotation.',
      },
      {
        question: 'Does an email acceptance count as binding?',
        answer: 'In most commercial jurisdictions, written acceptance by email from an authorized corporate officer constitutes a valid acceptance of a quotation.',
      },
    ],
    relatedSlugs: ['how-to-create-a-professional-quotation', 'supplier-quotation-format', 'common-quotation-mistakes'],
  },
  {
    slug: 'how-to-create-a-quotation-pdf',
    title: 'How to Create a Professional Quotation PDF: Layout, Resolution & Printing',
    subtitle: 'Ensure your exported PDFs look crisp, print cleanly on standard office printers, and never cut off table rows.',
    metaDescription: 'Learn how to generate professional A4 quotation PDFs. Formatting guidelines for logo resolution, multi-page tables, and email-ready file sizes.',
    category: 'Fundamentals',
    readTime: '5 min read',
    publishedDate: '2026-10-21',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro UI/UX Engineering',
    keyTakeaways: [
      'Standard A4 portrait (210mm × 297mm) is the international standard for professional business quotations.',
      'Vector PDF output produces crystal-clear typography and small file sizes (~30-60 KB) compared to blurry screenshots (~3 MB).',
      'Table headers must repeat on subsequent pages for multi-page documents.',
      'Totals and signature lines must never be clipped across page boundaries.',
    ],
    sections: [
      {
        id: 'a4-standards',
        title: '1. Why A4 Portrait Dimensions Are the Gold Standard',
        content: `In the business world, non-standard page sizes create friction. If a client prints your quotation on an office laser printer, standard A4 (210mm × 297mm) guarantees that margins, headers, and footer disclaimers remain inside the printable area.

QuoteWork Pro's PDF engine adheres strictly to A4 portrait formatting with 14mm margins, ensuring seamless printing on any standard laser or inkjet printer.`,
      },
      {
        id: 'vector-vs-raster',
        title: '2. The Difference Between Vector PDFs and Screenshots',
        content: `Many legacy web tools take a raster screenshot (canvas image) of the website, slice it into pieces, and paste it into a PDF. This causes:
- Blurry text when zoomed in on high-resolution screens.
- Inability for procurement officers to copy text, quote numbers, or part numbers.
- Huge file sizes (2 MB to 5 MB) that bounce on corporate email servers.

In contrast, QuoteWork Pro compiles a **true vector PDF document** using jsPDF and AutoTable:
- Fonts and borders are drawn as vector commands, razor-sharp at any zoom level.
- File sizes are lightweight (~20 KB to 50 KB), ideal for mobile WhatsApp and email delivery.
- Text is selectable, searchable, and accessible.`,
      },
      {
        id: 'pagination',
        title: '3. Handling Long Quotations with Automatic Pagination',
        content: `When a quotation has 15 or 30 line items, naive PDF tools split table rows right through the middle of text lines.

QuoteWork Pro includes built-in pagination guards:
- **\`showHead: 'everyPage'\`**: Table column headers automatically repeat at the top of page 2 and page 3.
- **\`rowPageBreak: 'avoid'\`**: Rows are never cut in half; if a row doesn't fit, it shifts to the next page.
- **Totals Guard**: If the bottom of the page lacks space for the grand total card and signature lines, the system gracefully opens a clean new page.`,
      },
    ],
    faqs: [
      {
        question: 'Can I email the PDF directly from my phone?',
        answer: 'Yes. QuoteWork Pro generates the PDF directly on your smartphone browser. You can save it to your files or share it immediately via WhatsApp or Gmail.',
      },
      {
        question: 'How do I ensure my logo looks sharp on the PDF?',
        answer: 'Upload a clean PNG or JPEG logo with a transparent background. QuoteWork Pro automatically resizes and calculates the correct aspect ratio to prevent stretching.',
      },
    ],
    relatedSlugs: ['how-to-create-a-professional-quotation', 'quotation-format-sri-lanka', 'common-quotation-mistakes'],
  },
  {
    slug: 'common-quotation-mistakes',
    title: '8 Common Mistakes When Preparing Quotations (And How to Avoid Them)',
    subtitle: 'Avoid the common traps that cost small businesses money, create client disputes, and cause lost contracts.',
    metaDescription: 'Discover 8 critical quotation mistakes made by small businesses and contractors. Learn how to prevent underpricing, scope creep, and lost deals.',
    category: 'Fundamentals',
    readTime: '6 min read',
    publishedDate: '2026-10-10',
    updatedDate: '2026-10-24',
    author: 'QuoteWork Pro Business Advisory',
    keyTakeaways: [
      'Missing validity dates expose suppliers to cost increases on accepted old quotes.',
      'Vague descriptions lead to unbudgeted scope creep and dispute over deliverables.',
      'Miscalculating discounts and tax order can lead to tax penalties or lost revenue.',
      'Unclear delivery and freight terms cause disputes over logistics costs.',
    ],
    sections: [
      {
        id: 'mistake-1',
        title: '1. Leaving Off an Expiry or Validity Date',
        content: `Hardware components, freight, and currency rates change rapidly. An open-ended quote leaves you legally vulnerable if a customer accepts months later after your wholesale costs have spiked. Always state a 14 to 30 day validity window.`,
      },
      {
        id: 'mistake-2',
        title: '2. Confusing Quotations with Tax Invoices',
        content: `Invoicing before an offer is agreed upon can create accidental VAT liabilities and confuse your accounting records. Always issue a quotation first, and convert it to a Tax Invoice only when work is completed or payment is due.`,
      },
      {
        id: 'mistake-3',
        title: '3. Hidden or Unstated Additional Charges',
        content: `Few things annoy corporate clients more than agreeing to a Rs. 200,000 quote and then receiving a surprise bill with an extra Rs. 15,000 for "handling and delivery." Always include an explicit line item for transport, delivery, or installation in your initial quote.`,
      },
      {
        id: 'mistake-4',
        title: '4. Lack of Clear Payment Terms',
        content: `Never leave payment expectations unsaid. If you require a 50% advance before ordering equipment, state it in the payment terms box. Doing so sets professional expectations from day one.`,
      },
      {
        id: 'mistake-5',
        title: '5. Manual Calculation & Rounding Errors',
        content: `Calculating VAT, multi-item discounts, and subtotals on a calculator often leads to rounding discrepancies when verified by corporate accountants. Use QuoteWork Pro's validated financial engine to eliminate human math errors.`,
      },
    ],
    faqs: [
      {
        question: 'What should I do if a client accepts a quote after it has expired?',
        answer: 'You have the legal right to re-quote. Review your current supplier costs and either confirm that the original price stands or issue an updated quotation with current pricing.',
      },
      {
        question: 'Should I follow up after sending a quotation?',
        answer: 'Yes. Standard practice is to follow up within 2 to 3 business days to confirm receipt, answer technical questions, and assess whether adjustments are needed.',
      },
    ],
    relatedSlugs: ['how-to-create-a-professional-quotation', 'quotation-vs-invoice', 'quotation-terms-and-conditions'],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(slugs: string[]): Guide[] {
  return GUIDES.filter((g) => slugs.includes(g.slug));
}
