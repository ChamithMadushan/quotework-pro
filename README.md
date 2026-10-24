# QuoteWork Pro — Professional Online Quotation Generator

A high-performance, responsive online quotation builder tailored for small businesses, contractors, freelancers, tech suppliers, CCTV installers, and service providers. Initially optimized for **Sri Lanka (LKR)** with full multi-currency flexibility (USD, EUR, GBP, AUD, SGD, INR, AED).

---

## ✨ Features

- **No Sign-Up Required**: Zero friction. Immediate access to quotation generation without creating an account or storing sensitive business data on external servers.
- **Privacy & Security**: All business data, customer records, and logo uploads remain 100% in local browser storage (`localStorage`). No backend logging or data harvesting.
- **Precision Financial Math**: All calculations (item discounts, overall discount, tax, subtotal, and grand total) are calculated using integer cents arithmetic to completely eliminate floating-point rounding errors.
- **Tax & Discount Rules**:
  - Item-level discounts (percentage or fixed amount).
  - Quotation-level overall discount.
  - Configurable VAT / SSCL / Sales tax rates with automatic calculation.
- **Professional PDF Export**: Export pixel-perfect A4 quotations with vector-quality rendering powered by `html2canvas` and `jsPDF`, or use the native browser print preview.
- **Custom Branding**:
  - Upload business logo (with automatic client-side resizing and optimization).
  - Business contact details (phone, email, registration / BRN / VAT numbers).
  - Banking details, payment terms, and validity periods.
- **Saved Drafts**: Save multiple quotation drafts locally, switch between them, or duplicate/delete drafts at any time.
- **Mobile First & Responsive**: Optimized for phones, tablets, laptops, and ultra-wide desktop monitors.
- **SEO & Performance**: Pre-rendered semantic HTML, Schema.org `WebApplication` structured data, Open Graph meta tags, and high Lighthouse scores.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vite.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: Handcrafted Modern CSS Design System (no heavy utility bloat, smooth animations, glassmorphism, responsive typography)
- **PDF Generation**: `jspdf` + `html2canvas`
- **Data Persistence**: HTML5 `localStorage`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0 or higher recommended)
- npm or pnpm or yarn

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in your browser
# Access http://localhost:5173
```

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
Quotation Creator/
├── public/                 # Static assets (favicons, manifest)
├── docs/                   # Architectural & strategic documentation
│   ├── ARCHITECTURE.md     # System design & data flow
│   ├── ROADMAP.md          # Future roadmap & monetization
│   └── SEO_PLAN.md         # Organic search & target keyword strategy
├── src/
│   ├── components/         # Reusable UI & form components
│   │   ├── generator/      # Form sections (Business, Customer, Items, Totals, Terms, Drafts)
│   │   ├── Field.tsx       # Standardized input & error wrapper
│   │   ├── Layout.tsx      # App shell with header and footer
│   │   └── QuotationPreview.tsx # Live A4 quotation rendering template
│   ├── context/            # QuotationContext & global state management
│   ├── lib/                # Pure utility functions
│   │   ├── calculations.ts # Integer-cents financial engine
│   │   ├── currency.ts     # Currency metadata & formatters
│   │   ├── ids.ts          # Quotation number & date utilities
│   │   ├── logo.ts         # Image compression & data URL conversion
│   │   ├── pdf.ts          # Client-side PDF export
│   │   ├── storage.ts      # localStorage draft management
│   │   └── validation.ts   # Form validation & error tracking
│   ├── pages/              # Routed views (Home, Create, Preview, How It Works, About, Privacy)
│   ├── types/              # Full TypeScript definitions
│   ├── styles.css          # Core design system & theme variables
│   ├── App.tsx             # Root router configuration
│   └── main.tsx            # Application entrypoint
├── index.html              # HTML shell with meta tags & Schema.org markup
└── vite.config.ts          # Vite build configuration
```

---

## 📄 License

MIT License — Free to use for personal and commercial quotation creation.
