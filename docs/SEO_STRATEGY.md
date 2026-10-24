# QuoteWork Pro — Comprehensive SEO & Content Strategy

## 1. Executive Summary

QuoteWork Pro is an online quotation creation workspace designed for Sri Lankan businesses, contractors, freelancers, and international traders. This strategy outlines the technical SEO architecture, keyword intent clusters, and content marketing blueprint designed to capture high-intent commercial and informational searches without resorting to deceptive practices (such as fake star ratings, fictitious reviews, or keyword stuffing).

---

## 2. Keyword Research Themes & Intent Mapping

### 2.1 Keyword Theme Analysis

| Keyword Theme | Search Intent | Competition Tier | Target URL / Asset | Core User Need |
| :--- | :--- | :--- | :--- | :--- |
| **Free quotation generator** | Transactional / Tool | High (Global) | `/` & `/create` | Quick, frictionless generation of a printable/downloadable quote without paying or signing up. |
| **Online quotation maker** | Transactional / Tool | High (Global) | `/` & `/create` | In-browser tool with live preview and line-item customization. |
| **Quotation format Sri Lanka** | Informational & Transactional | Low–Medium (Regional) | `/guides/quotation-format-sri-lanka` & `/create` | Correct formatting adhering to Sri Lankan commercial practice (LKR, BRN, VAT/SSCL, standard payment terms). |
| **LKR quotation generator** | Transactional (High intent) | Low (Regional Niche) | `/` & `/create` | Specific requirement for Sri Lankan Rupee currency formatting, commas, and zero-decimal rounding. |
| **Business quotation template** | Informational / Template | High (Global) | `/guides/how-to-create-a-professional-quotation` | Understanding what sections to include in a formal commercial quote. |
| **Quotation PDF generator** | Transactional / Tool | Medium–High | `/guides/how-to-create-a-quotation-pdf` & `/preview` | Immediate export to vector/clean A4 PDF suitable for emailing to corporate procurement. |
| **Supplier quotation format** | Commercial Informational | Medium (B2B) | `/guides/supplier-quotation-format` | B2B supplier responses to RFQs, MOQs, lead times, delivery terms (FOB/CIF). |
| **Service quotation template** | Commercial Informational | Medium | `/guides/how-to-create-a-professional-quotation` | Hourly/milestone vs fixed-price quotation for professional service providers. |
| **Quotation maker for small businesses** | Transactional / Solution | Medium | `/` & `/about` | Lightweight alternative to bulky ERPs or expensive accounting software. |
| **Quotation vs invoice** | Educational / Top-of-funnel | Medium–High | `/guides/quotation-vs-invoice` | Disambiguation of legal status, accounting treatment, and workflow between estimate and bill. |
| **Quotation discount calculation** | Informational / Math | Low–Medium | `/guides/how-to-calculate-discounts-in-quotations` | Formulas for trade discounts, early-payment discounts, and compounding line discounts. |
| **Quotation terms and conditions** | Legal / Best practice | Medium | `/guides/quotation-terms-and-conditions` | Standard clauses: validity period, price revision, payment milestones, dispute jurisdiction. |

*(Note: In adherence to honest SEO guidelines, specific monthly search volumes and keyword difficulties fluctuate dynamically across search engines and regions, and are measured via Google Search Console and official keyword planning tools rather than fabricated estimates).*

---

## 3. Technical SEO Implementation

### 3.1 Metadata Architecture

Each page in QuoteWork Pro dynamically maintains standard metadata tags via `src/components/SEO.tsx`:
- **Document `<title>`**: Strict structure of `Primary Focus Keyword | Brand` or `Topic: Specific Outcome | QuoteWork Pro`. Capped under 60 characters to avoid SERP truncation.
- **`<meta name="description">`**: Action-oriented, value-first summaries between 135–158 characters with natural keyword placement.
- **`<link rel="canonical">`**: Absolute canonical URLs (`https://quoteworkpro.com/...`) preventing duplicate content indexing across parameters or mirrors.
- **Open Graph & Twitter Cards**: `og:title`, `og:description`, `og:type`, `og:image`, `twitter:card`, and `twitter:title` on all pages to ensure rich embeds when shared via WhatsApp, LinkedIn, and email.

### 3.2 Structured Data (Schema.org JSON-LD)

To maximize Rich Snippet eligibility and search engine understanding while strictly avoiding deceptive structured data:

1. **`WebApplication` Schema (Homepage `/` & `/create`)**:
   - `applicationCategory`: `BusinessApplication`
   - `operatingSystem`: `Any modern web browser`
   - `offers`: Free (`price: 0, priceCurrency: USD`)
   - *Strict Compliance:* Zero fake aggregate ratings or fake review counts are published.
2. **`Article` Schema (All 8 Guide Articles)**:
   - Full publication dates (`datePublished`, `dateModified`)
   - Author and Publisher details (`QuoteWork Pro`)
   - Headline and image properties
3. **`FAQPage` Schema (Guides & How-it-Works)**:
   - Matches visible, accessible accordion FAQs 1:1.
   - Crawlers read question-and-answer pairs directly corresponding to on-page copy.
4. **`BreadcrumbList` Schema (Articles & Nested Pages)**:
   - Clear hierarchal mapping: `Home > Guides > [Article Name]`.

### 3.3 Crawlability & Site Architecture

- **`robots.txt`**: Located at `/robots.txt`, granting access to all content paths while disallowing raw internal API routes (`/api/`), with an explicit pointer to `https://quoteworkpro.com/sitemap.xml`.
- **`sitemap.xml`**: Clean XML protocol with `<lastmod>`, `<changefreq>`, and `<priority>` weights (1.0 for Homepage, 0.9 for Generator, 0.85 for Guides hub and Regional format, 0.8 for all substantive guides).
- **Heading Hierarchy**: Exactly one semantic `<h1>` per page, followed by logical `<h2>` and `<h3>` tags.
- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` containers for assistive technology and crawler clarity.

---

## 4. Content Strategy & Topical Authority

### 4.1 Hub-and-Spoke Architecture

```
                       ┌─────────────────────────┐
                       │   Homepage & Generator  │
                       │     QuoteWork Pro       │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │   Quotation Guides Hub  │
                       │         /guides         │
                       └────────────┬────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  Regional    │             │ Fundamentals │             │  Commercial  │
│ Sri Lanka    │             │ Professional │             │ Supplier     │
│ Format Guide │             │ Quote Guide  │             │ Quote Guide  │
└──────┬───────┘             └──────┬───────┘             └──────┬───────┘
       │                            │                            │
       └────────────────────────────┴────────────────────────────┘
                                    │
                                    ▼
                       [ Direct Call-To-Action ]
                       "Create Free Quotation"
```

### 4.2 Content Assets Summary

1. **How to Create a Professional Quotation** (`/guides/how-to-create-a-professional-quotation`)
   - *Target Intent:* Foundational business quotation structure, mandatory elements, customer communication.
   - *Key CTA:* Launches the generator with standard business layout.
2. **Quotation Format for Sri Lankan Businesses** (`/guides/quotation-format-sri-lanka`)
   - *Target Intent:* Sri Lankan commercial standards, Business Registration Numbers (BRN), VAT/SSCL compliance, and Colombo commercial practices.
   - *Key CTA:* Launches tool with default LKR currency.
3. **Quotation vs Invoice: Key Differences** (`/guides/quotation-vs-invoice`)
   - *Target Intent:* Educational comparison, legal enforceability, tax obligations, and commercial progression.
4. **How to Calculate Discounts in a Quotation** (`/guides/how-to-calculate-discounts-in-quotations`)
   - *Target Intent:* Step-by-step formulas for line-item percentages, fixed amounts, and compound discounts.
5. **How to Prepare a Supplier Quotation** (`/guides/supplier-quotation-format`)
   - *Target Intent:* B2B wholesale, MOQs, Incoterms, lead times, and price escalation clauses.
6. **Quotation Terms and Conditions Explained** (`/guides/quotation-terms-and-conditions`)
   - *Target Intent:* Risk management, validity windows, payment schedules, and scope-creep protection.
7. **How to Create a Quotation PDF** (`/guides/how-to-create-a-quotation-pdf`)
   - *Target Intent:* Technical tips on vector typography, A4 page splits, and printable documents.
8. **Common Mistakes When Preparing Quotations** (`/guides/common-quotation-mistakes`)
   - *Target Intent:* Loss prevention, math errors, vague specifications, and weak follow-up habits.

---

## 5. Mobile & Core Web Vitals Optimization

1. **Lightweight Footprint**: Client-side single-page application built on Vite + React + Vanilla CSS with zero external heavyweight CSS frameworks.
2. **Client-Side PDF Generation**: Fast vector PDF generation via jsPDF with zero server latency.
3. **Local Storage First**: Instant draft loading with zero database round-trip required for regular usage.
4. **Responsive Breakpoints**: Tailored responsive layouts tested across 320px mobile up to 4K ultra-wide displays.
