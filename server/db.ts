import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import type { Quotation, LineItem } from '../src/types/quotation';
import { calculateTotals } from '../src/lib/calculations';

// Ensure data folder exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'quotecraft.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for durability and performance
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize all database tables and seed initial data if empty.
 */
export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS business_profile (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      address TEXT,
      city TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      tax_id TEXT,
      logo_data_url TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quotations (
      id TEXT PRIMARY KEY,
      number TEXT UNIQUE NOT NULL,
      date TEXT NOT NULL,
      valid_until TEXT,
      currency TEXT NOT NULL DEFAULT 'LKR',
      status TEXT NOT NULL DEFAULT 'draft',
      project_reference TEXT,
      business_name TEXT,
      business_company TEXT,
      business_address TEXT,
      business_city TEXT,
      business_phone TEXT,
      business_email TEXT,
      business_website TEXT,
      business_tax_id TEXT,
      business_logo_url TEXT,
      customer_name TEXT,
      customer_company TEXT,
      customer_address TEXT,
      customer_city TEXT,
      customer_phone TEXT,
      customer_email TEXT,
      tax_enabled INTEGER DEFAULT 0,
      tax_name TEXT DEFAULT 'VAT',
      tax_rate REAL DEFAULT 18,
      tax_inclusive INTEGER DEFAULT 0,
      doc_discount_type TEXT DEFAULT 'none',
      doc_discount_value REAL DEFAULT 0,
      additional_charges REAL DEFAULT 0,
      additional_charges_label TEXT,
      payment_terms TEXT,
      delivery_info TEXT,
      notes TEXT,
      terms TEXT,
      show_signature INTEGER DEFAULT 1,
      signature_title TEXT DEFAULT 'Authorized Signature',
      subtotal REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      grand_total REAL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quotation_items (
      id TEXT PRIMARY KEY,
      quotation_id TEXT NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
      position INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL DEFAULT 0,
      discount_type TEXT DEFAULT 'none',
      discount_value REAL DEFAULT 0,
      net_amount REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      address TEXT,
      city TEXT,
      phone TEXT,
      email TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS catalog_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit_price REAL NOT NULL DEFAULT 0,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(number);
    CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
    CREATE INDEX IF NOT EXISTS idx_quotations_date ON quotations(date);
    CREATE INDEX IF NOT EXISTS idx_items_quote_id ON quotation_items(quotation_id);
  `);

  // Seed default business profile if not present
  const bizCount = db.prepare('SELECT COUNT(*) as count FROM business_profile').get() as { count: number };
  if (bizCount.count === 0) {
    db.prepare(`
      INSERT INTO business_profile (
        id, name, company, address, city, phone, email, website, tax_id, logo_data_url, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'default',
      'Apex Smart Solutions (Pvt) Ltd',
      'Apex Technologies',
      'No. 142/A, Galle Road, Bambalapitiya',
      'Colombo 04, Sri Lanka',
      '+94 11 258 9632 / +94 77 712 3456',
      'sales@apexsmart.lk',
      'www.apexsmart.lk',
      'PV-00284719 / VAT 1029384-7000',
      null,
      new Date().toISOString(),
    );
  }

  // Seed catalog items if empty
  const catalogCount = db.prepare('SELECT COUNT(*) as count FROM catalog_items').get() as { count: number };
  if (catalogCount.count === 0) {
    const seedCatalog = [
      ['cat-1', 'Hikvision 16-Channel 4K AcuSense NVR (DS-7616NXI-K2)', 'CCTV & Security', 115000, '4K 16-channel Network Video Recorder with smart AcuSense facial/vehicle detection.'],
      ['cat-2', 'Hikvision 5MP Outdoor IR Network Turret IP Camera', 'CCTV & Security', 16500, '5MP IP67 waterproof with EXIR night vision up to 30m.'],
      ['cat-3', 'Western Digital 4TB Purple Surveillance Hard Drive', 'Storage', 42000, 'Engineered for 24/7 always-on high-definition surveillance systems.'],
      ['cat-4', 'Schneider Electric Cat6 UTP 305m Cable Box', 'Networking', 38500, 'High-grade copper cabling for gigabit Ethernet networks.'],
      ['cat-5', 'CCTV Installation, Cabling & Setup (per camera point)', 'Services', 3500, 'Conduit casing, cable termination, camera mounting, and focusing.'],
      ['cat-6', 'Network Setup & Remote Mobile App Viewing Configuration', 'Services', 15000, 'Router port forwarding / P2P Cloud setup for live smartphone viewing.'],
      ['cat-7', 'MikroTik Cloud Router Switch 24-Port Gigabit with PoE', 'Networking', 92000, 'Managed rackmount Layer 3 switch with redundant power supply.'],
      ['cat-8', 'Annual Maintenance Contract (Quarterly Inspection)', 'Services', 48000, 'Quarterly camera lens cleaning, firmware updates, and backup checks.'],
    ];

    const stmt = db.prepare(`
      INSERT INTO catalog_items (id, name, category, unit_price, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const item of seedCatalog) {
      stmt.run(item[0], item[1], item[2], item[3], item[4], new Date().toISOString());
    }
  }

  // Seed initial quotations if table is empty
  const quoteCount = db.prepare('SELECT COUNT(*) as count FROM quotations').get() as { count: number };
  if (quoteCount.count === 0) {
    import('../src/lib/defaults').then(({ createSampleQuotation }) => {
      const sample = createSampleQuotation();
      saveQuotationToDb(sample, 'sent');
    });
  }
}

/**
 * Saves or updates a quotation and its line items in SQLite.
 */
export function saveQuotationToDb(quote: Quotation, status = 'draft'): Quotation {
  const totals = calculateTotals(quote);
  const now = new Date().toISOString();

  // Check if quotation already exists
  const existing = db.prepare('SELECT id, created_at FROM quotations WHERE id = ?').get(quote.id) as { id: string; created_at: string } | undefined;
  const createdAt = existing?.created_at ?? now;

  db.exec('BEGIN TRANSACTION;');
  try {
    // Upsert quotation header
    db.prepare(`
      INSERT INTO quotations (
        id, number, date, valid_until, currency, status, project_reference,
        business_name, business_company, business_address, business_city,
        business_phone, business_email, business_website, business_tax_id, business_logo_url,
        customer_name, customer_company, customer_address, customer_city,
        customer_phone, customer_email,
        tax_enabled, tax_name, tax_rate, tax_inclusive,
        doc_discount_type, doc_discount_value,
        additional_charges, additional_charges_label,
        payment_terms, delivery_info, notes, terms,
        show_signature, signature_title,
        subtotal, tax_amount, discount_amount, grand_total,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        number = excluded.number,
        date = excluded.date,
        valid_until = excluded.valid_until,
        currency = excluded.currency,
        status = excluded.status,
        project_reference = excluded.project_reference,
        business_name = excluded.business_name,
        business_company = excluded.business_company,
        business_address = excluded.business_address,
        business_city = excluded.business_city,
        business_phone = excluded.business_phone,
        business_email = excluded.business_email,
        business_website = excluded.business_website,
        business_tax_id = excluded.business_tax_id,
        business_logo_url = excluded.business_logo_url,
        customer_name = excluded.customer_name,
        customer_company = excluded.customer_company,
        customer_address = excluded.customer_address,
        customer_city = excluded.customer_city,
        customer_phone = excluded.customer_phone,
        customer_email = excluded.customer_email,
        tax_enabled = excluded.tax_enabled,
        tax_name = excluded.tax_name,
        tax_rate = excluded.tax_rate,
        tax_inclusive = excluded.tax_inclusive,
        doc_discount_type = excluded.doc_discount_type,
        doc_discount_value = excluded.doc_discount_value,
        additional_charges = excluded.additional_charges,
        additional_charges_label = excluded.additional_charges_label,
        payment_terms = excluded.payment_terms,
        delivery_info = excluded.delivery_info,
        notes = excluded.notes,
        terms = excluded.terms,
        show_signature = excluded.show_signature,
        signature_title = excluded.signature_title,
        subtotal = excluded.subtotal,
        tax_amount = excluded.tax_amount,
        discount_amount = excluded.discount_amount,
        grand_total = excluded.grand_total,
        updated_at = excluded.updated_at;
    `).run(
      quote.id,
      quote.number,
      quote.date,
      quote.validUntil || null,
      quote.currency || 'LKR',
      status,
      quote.projectReference || null,
      quote.business.name || '',
      quote.business.company || '',
      quote.business.address || '',
      quote.business.city || '',
      quote.business.phone || '',
      quote.business.email || '',
      quote.business.website || '',
      quote.business.taxId || '',
      quote.business.logoDataUrl || null,
      quote.customer.name || '',
      quote.customer.company || '',
      quote.customer.address || '',
      quote.customer.city || '',
      quote.customer.phone || '',
      quote.customer.email || '',
      quote.tax.enabled ? 1 : 0,
      quote.tax.name || 'VAT',
      quote.tax.rate || 0,
      quote.tax.inclusive ? 1 : 0,
      quote.documentDiscount.type || 'none',
      quote.documentDiscount.value || 0,
      quote.additionalCharges || 0,
      quote.additionalChargesLabel || '',
      quote.paymentTerms || '',
      quote.deliveryInfo || '',
      quote.notes || '',
      quote.terms || '',
      quote.showSignature !== false ? 1 : 0,
      quote.signatureTitle || 'Authorized Signature',
      totals.subtotal,
      totals.tax,
      totals.documentDiscount + totals.itemDiscounts,
      totals.total,
      createdAt,
      now,
    );

    // Delete old items and insert fresh
    db.prepare('DELETE FROM quotation_items WHERE quotation_id = ?').run(quote.id);

    const insertItem = db.prepare(`
      INSERT INTO quotation_items (
        id, quotation_id, position, description, quantity, unit_price, discount_type, discount_value, net_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    quote.items.forEach((item, pos) => {
      const lineTot = totals.lines.find((l) => l.id === item.id);
      insertItem.run(
        item.id,
        quote.id,
        pos,
        item.description,
        item.quantity,
        item.unitPrice,
        item.discountType || 'none',
        item.discountValue || 0,
        lineTot?.net ?? 0,
      );
    });

    // Also auto-save customer to directory if customer name or company is given
    if (quote.customer.name || quote.customer.company) {
      const custId = `cust-${encodeURIComponent((quote.customer.company || quote.customer.name).toLowerCase().replace(/\s+/g, '-'))}`;
      db.prepare(`
        INSERT INTO customers (id, name, company, address, city, phone, email, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          company = excluded.company,
          address = excluded.address,
          city = excluded.city,
          phone = excluded.phone,
          email = excluded.email,
          updated_at = excluded.updated_at
      `).run(
        custId,
        quote.customer.name || '',
        quote.customer.company || '',
        quote.customer.address || '',
        quote.customer.city || '',
        quote.customer.phone || '',
        quote.customer.email || '',
        now,
        now,
      );
    }

    db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }

  return getQuotationById(quote.id)!;
}

/**
 * Retrieves a quotation by its ID including all line items.
 */
export function getQuotationById(id: string): (Quotation & { status: string; subtotal: number; taxAmount: number; grandTotal: number; createdAt: string }) | null {
  const row = db.prepare('SELECT * FROM quotations WHERE id = ?').get(id) as any;
  if (!row) return null;

  const itemRows = db.prepare('SELECT * FROM quotation_items WHERE quotation_id = ? ORDER BY position ASC').all(id) as any[];

  const items: LineItem[] = itemRows.map((r) => ({
    id: r.id,
    description: r.description,
    quantity: Number(r.quantity),
    unitPrice: Number(r.unit_price),
    discountType: r.discount_type,
    discountValue: Number(r.discount_value),
  }));

  return {
    id: row.id,
    number: row.number,
    date: row.date,
    validUntil: row.valid_until || '',
    currency: row.currency,
    status: row.status,
    projectReference: row.project_reference || '',
    business: {
      name: row.business_name || '',
      company: row.business_company || '',
      address: row.business_address || '',
      city: row.business_city || '',
      phone: row.business_phone || '',
      email: row.business_email || '',
      website: row.business_website || '',
      taxId: row.business_tax_id || '',
      logoDataUrl: row.business_logo_url || null,
    },
    customer: {
      name: row.customer_name || '',
      company: row.customer_company || '',
      address: row.customer_address || '',
      city: row.customer_city || '',
      phone: row.customer_phone || '',
      email: row.customer_email || '',
    },
    items,
    tax: {
      enabled: Boolean(row.tax_enabled),
      name: row.tax_name || 'VAT',
      rate: Number(row.tax_rate),
      inclusive: Boolean(row.tax_inclusive),
    },
    documentDiscount: {
      type: row.doc_discount_type,
      value: Number(row.doc_discount_value),
    },
    additionalCharges: Number(row.additional_charges || 0),
    additionalChargesLabel: row.additional_charges_label || '',
    paymentTerms: row.payment_terms || '',
    deliveryInfo: row.delivery_info || '',
    notes: row.notes || '',
    terms: row.terms || '',
    showSignature: Boolean(row.show_signature),
    signatureTitle: row.signature_title || 'Authorized Signature',
    subtotal: Number(row.subtotal),
    taxAmount: Number(row.tax_amount),
    grandTotal: Number(row.grand_total),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Lists quotations with optional search, status filtering, and sorting.
 */
export function listQuotations(options: { query?: string; status?: string; limit?: number; offset?: number } = {}) {
  const { query, status, limit = 50, offset = 0 } = options;

  let sql = 'SELECT * FROM quotations WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (query && query.trim()) {
    sql += ' AND (number LIKE ? OR business_name LIKE ? OR customer_name LIKE ? OR customer_company LIKE ? OR project_reference LIKE ?)';
    const wild = `%${query.trim()}%`;
    params.push(wild, wild, wild, wild, wild);
  }

  sql += ' ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const rows = db.prepare(sql).all(...params) as any[];

  return rows.map((row) => ({
    id: row.id,
    number: row.number,
    date: row.date,
    validUntil: row.valid_until,
    currency: row.currency,
    status: row.status,
    customerName: row.customer_company || row.customer_name || 'Customer',
    projectReference: row.project_reference,
    grandTotal: Number(row.grand_total),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

/**
 * Deletes a quotation and its line items (via CASCADE).
 */
export function deleteQuotationFromDb(id: string): boolean {
  const info = db.prepare('DELETE FROM quotations WHERE id = ?').run(id) as any;
  return info.changes > 0;
}

/**
 * Updates quotation status (e.g. 'draft', 'sent', 'accepted', 'declined').
 */
export function updateQuotationStatusInDb(id: string, status: string): boolean {
  const info = db.prepare('UPDATE quotations SET status = ?, updated_at = ? WHERE id = ?').run(
    status,
    new Date().toISOString(),
    id,
  ) as any;
  return info.changes > 0;
}

/**
 * Calculates dashboard analytics.
 */
export function getAnalytics() {
  const totals = db.prepare(`
    SELECT
      COUNT(*) as totalQuotes,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draftCount,
      SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sentCount,
      SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as acceptedCount,
      SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declinedCount,
      SUM(grand_total) as totalVolume,
      SUM(CASE WHEN status = 'accepted' THEN grand_total ELSE 0 END) as acceptedVolume
    FROM quotations
  `).get() as any;

  const currencyBreakdown = db.prepare(`
    SELECT currency, COUNT(*) as count, SUM(grand_total) as totalSum
    FROM quotations
    GROUP BY currency
    ORDER BY totalSum DESC
  `).all() as any[];

  return {
    ...totals,
    totalVolume: Number(totals.totalVolume || 0),
    acceptedVolume: Number(totals.acceptedVolume || 0),
    currencyBreakdown,
  };
}
