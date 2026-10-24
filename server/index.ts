import express, { type Request, type Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import {
  initDatabase,
  db,
  saveQuotationToDb,
  getQuotationById,
  listQuotations,
  deleteQuotationFromDb,
  updateQuotationStatusInDb,
  getAnalytics,
} from './db';
import { calculateTotals } from '../src/lib/calculations';
import { createId, createQuotationNumber } from '../src/lib/ids';
import { generateQuotationPdf } from '../src/lib/pdf';
import type { Quotation } from '../src/types/quotation';

// Initialize SQLite database
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' })); // Support base64 logo data URLs

// ── Health Check ──────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  const count = db.prepare('SELECT COUNT(*) as count FROM quotations').get() as { count: number };
  res.json({
    status: 'ok',
    database: 'SQLite (node:sqlite)',
    quotationsCount: count.count,
    timestamp: new Date().toISOString(),
  });
});

// ── Quotations CRUD ───────────────────────────────────────
// List quotations
app.get('/api/quotations', (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
    const offset = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;

    const list = listQuotations({ query, status, limit, offset });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single quotation
app.get('/api/quotations/:id', (req: Request, res: Response) => {
  try {
    const quotation = getQuotationById(req.params.id);
    if (!quotation) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    const totals = calculateTotals(quotation);
    res.json({ quotation, totals });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create new quotation
app.post('/api/quotations', (req: Request, res: Response) => {
  try {
    const data = req.body as Quotation;
    if (!data.id) {
      data.id = createId('quote');
    }
    if (!data.number) {
      data.number = createQuotationNumber();
    }
    const status = (req.body.status as string) || 'draft';
    const saved = saveQuotationToDb(data, status);
    const totals = calculateTotals(saved);
    res.status(201).json({ quotation: saved, totals });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update existing quotation
app.put('/api/quotations/:id', (req: Request, res: Response) => {
  try {
    const data = req.body as Quotation;
    data.id = req.params.id;
    const status = (req.body.status as string) || 'draft';
    const saved = saveQuotationToDb(data, status);
    const totals = calculateTotals(saved);
    res.json({ quotation: saved, totals });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update quotation status
app.patch('/api/quotations/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status || !['draft', 'sent', 'accepted', 'declined'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be draft, sent, accepted, or declined.' });
      return;
    }
    const ok = updateQuotationStatusInDb(req.params.id, status);
    if (!ok) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    res.json({ success: true, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Duplicate quotation
app.post('/api/quotations/:id/duplicate', (req: Request, res: Response) => {
  try {
    const source = getQuotationById(req.params.id);
    if (!source) {
      res.status(404).json({ error: 'Source quotation not found' });
      return;
    }

    const cloned: Quotation = {
      ...source,
      id: createId('quote'),
      number: createQuotationNumber(),
      date: new Date().toISOString().slice(0, 10),
      items: source.items.map((it) => ({ ...it, id: createId('item') })),
      updatedAt: new Date().toISOString(),
    };

    const saved = saveQuotationToDb(cloned, 'draft');
    const totals = calculateTotals(saved);
    res.status(201).json({ quotation: saved, totals });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete quotation
app.delete('/api/quotations/:id', (req: Request, res: Response) => {
  try {
    const deleted = deleteQuotationFromDb(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    res.json({ success: true, id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Server-side PDF export
app.get('/api/quotations/:id/pdf', async (req: Request, res: Response) => {
  try {
    const quotation = getQuotationById(req.params.id);
    if (!quotation) {
      res.status(404).json({ error: 'Quotation not found' });
      return;
    }
    const totals = calculateTotals(quotation);
    const pdfDoc = await generateQuotationPdf(quotation, totals);
    const pdfArrayBuffer = pdfDoc.output('arraybuffer');
    const buffer = Buffer.from(pdfArrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${quotation.number || 'quotation'}.pdf"`);
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Business Profile ──────────────────────────────────────
app.get('/api/business', (_req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM business_profile WHERE id = ?').get('default') as any;
    if (!row) {
      res.json(null);
      return;
    }
    res.json({
      name: row.name,
      company: row.company,
      address: row.address,
      city: row.city,
      phone: row.phone,
      email: row.email,
      website: row.website,
      taxId: row.tax_id,
      logoDataUrl: row.logo_data_url,
      updatedAt: row.updated_at,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/business', (req: Request, res: Response) => {
  try {
    const b = req.body;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO business_profile (
        id, name, company, address, city, phone, email, website, tax_id, logo_data_url, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        company = excluded.company,
        address = excluded.address,
        city = excluded.city,
        phone = excluded.phone,
        email = excluded.email,
        website = excluded.website,
        tax_id = excluded.tax_id,
        logo_data_url = excluded.logo_data_url,
        updated_at = excluded.updated_at
    `).run(
      'default',
      b.name || '',
      b.company || '',
      b.address || '',
      b.city || '',
      b.phone || '',
      b.email || '',
      b.website || '',
      b.taxId || '',
      b.logoDataUrl || null,
      now,
    );
    res.json({ success: true, business: b });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Customers Directory ───────────────────────────────────
app.get('/api/customers', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM customers ORDER BY company ASC, name ASC').all();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', (req: Request, res: Response) => {
  try {
    const c = req.body;
    const id = c.id || createId('cust');
    const now = new Date().toISOString();
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
      id,
      c.name || '',
      c.company || '',
      c.address || '',
      c.city || '',
      c.phone || '',
      c.email || '',
      now,
      now,
    );
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Product / Service Catalog ─────────────────────────────
app.get('/api/catalog', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM catalog_items ORDER BY category ASC, name ASC').all();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/catalog', (req: Request, res: Response) => {
  try {
    const item = req.body;
    const id = item.id || createId('cat');
    db.prepare(`
      INSERT INTO catalog_items (id, name, category, unit_price, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      item.name,
      item.category || 'General',
      Number(item.unitPrice || 0),
      item.description || '',
      new Date().toISOString(),
    );
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Analytics ─────────────────────────────────────────────
app.get('/api/analytics', (_req: Request, res: Response) => {
  try {
    const metrics = getAnalytics();
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`🚀 QuoteWork Pro Backend & SQLite Database running on http://localhost:${PORT}`);
  console.log(`   Database File: ${path.resolve(process.cwd(), 'data/quotecraft.db')}`);
});

export { app, server };
