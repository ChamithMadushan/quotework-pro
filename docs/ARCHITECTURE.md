# Architecture and File Structure

## Stack

- **Frontend**: React 19 + TypeScript + Vite + React Router v7
- **Styling**: Handcrafted CSS design tokens & responsive components
- **PDF Export**: jsPDF + jspdf-autotable (vector A4 pagination) & `@media print`
- **Backend**: Express + TypeScript REST API (`server/index.ts`)
- **Database**: Embedded SQLite via Node v22 `node:sqlite` (`data/quotecraft.db`)
- **Local Fallback**: HTML5 `localStorage` for offline caching

---

## Database Schema (SQLite)

Located at `data/quotecraft.db`:

### 1. `quotations`
- `id` (TEXT, PK): Unique UUID
- `number` (TEXT, UNIQUE): Quotation number (e.g. `QT-20261024-8841`)
- `date` (TEXT): Issue date
- `valid_until` (TEXT): Expiry date
- `currency` (TEXT): Currency code (`LKR`, `USD`, `EUR`, etc.)
- `status` (TEXT): `'draft' | 'sent' | 'accepted' | 'declined'`
- `project_reference` (TEXT): Project name / PO reference
- `business_*`: Sender details (name, company, address, phone, email, taxId, logo)
- `customer_*`: Client details (name, company, address, phone, email)
- `tax_*`: Tax configuration (enabled, name, rate, inclusive)
- `doc_discount_*`: Overall document discount
- `additional_charges`: Extra fee amount & label (e.g. delivery/shipping)
- `payment_terms`, `delivery_info`, `notes`, `terms`: Standard document terms
- `subtotal`, `tax_amount`, `discount_amount`, `grand_total`: Calculated totals
- `created_at`, `updated_at`: Timestamps

### 2. `quotation_items`
- `id` (TEXT, PK)
- `quotation_id` (TEXT, FK -> `quotations.id` ON DELETE CASCADE)
- `position` (INTEGER): Row ordering
- `description` (TEXT): Item description (multiline)
- `quantity` (REAL)
- `unit_price` (REAL)
- `discount_type` (TEXT): `'none' | 'percent' | 'amount'`
- `discount_value` (REAL)
- `net_amount` (REAL)

### 3. `business_profile`
- Business singleton table storing the active company credentials and logo.

### 4. `customers`
- Reusable customer directory extracted from created quotations.

### 5. `catalog_items`
- Product and service catalog for fast quotation item selection.

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & quotation count |
| `GET` | `/api/quotations` | List quotations with search & status filters |
| `GET` | `/api/quotations/:id` | Get single quotation with items and totals |
| `POST` | `/api/quotations` | Create new quotation and save to database |
| `PUT` | `/api/quotations/:id` | Update existing quotation |
| `PATCH` | `/api/quotations/:id/status` | Update status (`draft`, `sent`, `accepted`, `declined`) |
| `POST` | `/api/quotations/:id/duplicate`| Clone an existing quotation |
| `DELETE` | `/api/quotations/:id` | Delete quotation and cascade its items |
| `GET` | `/api/quotations/:id/pdf` | Server-side vector PDF stream |
| `GET` | `/api/business` | Fetch saved business profile |
| `POST` | `/api/business` | Save/update business profile |
| `GET` | `/api/customers` | List saved customers |
| `POST` | `/api/customers` | Save customer to directory |
| `GET` | `/api/catalog` | List catalog items |
| `POST` | `/api/catalog` | Add new item to catalog |
| `GET` | `/api/analytics` | Summary metrics (totals, counts, currency sums) |
