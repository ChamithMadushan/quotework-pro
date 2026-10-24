import { Link } from 'react-router-dom';
import { SEO, StructuredData } from '../components/SEO';
import { GUIDES } from '../data/guides';

const webAppSchema: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': 'QuoteWork Pro',
  'url': 'https://quoteworkpro.com',
  'applicationCategory': 'BusinessApplication',
  'operatingSystem': 'Any modern web browser (Windows, macOS, Linux, iOS, Android)',
  'description': 'Free online quotation maker and PDF generator for Sri Lankan and global businesses. Create A4 quotations in LKR, USD, EUR with itemized pricing, tax calculations, and terms.',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD'
  },
  'featureList': [
    'A4 Portrait PDF Quotation Generation',
    'Sri Lanka LKR Currency and Multi-Currency Support',
    'Line-item and overall discount calculation',
    'Tax and VAT calculation',
    'Privacy-first local draft storage'
  ]
};

const features = [
  {
    icon: '📄',
    iconClass: 'icon-navy',
    title: 'Professional layout',
    desc: 'Clean, branded quotations with your logo, itemized line items, and a polished summary — ready to send.',
  },
  {
    icon: '🧮',
    iconClass: 'icon-teal',
    title: 'Accurate calculations',
    desc: 'Automatic subtotals, per-item discounts, document discounts, inclusive and exclusive VAT — all computed precisely.',
  },
  {
    icon: '📥',
    iconClass: 'icon-gold',
    title: 'PDF & print export',
    desc: 'Download a pixel-perfect PDF or print directly from your browser. No plugins or software required.',
  },
  {
    icon: '💾',
    iconClass: 'icon-navy',
    title: 'Local draft saving',
    desc: 'Save up to 20 quotation drafts directly in your browser. No sign-up, no server, no data sent anywhere.',
  },
  {
    icon: '🌏',
    iconClass: 'icon-teal',
    title: 'Multi-currency ready',
    desc: 'LKR first, with USD, EUR, GBP, INR, AED, SGD, and AUD included and ready to select.',
  },
  {
    icon: '📱',
    iconClass: 'icon-gold',
    title: 'Mobile friendly',
    desc: 'Fill in the form on your phone, tablet, or desktop. The live preview and PDF export work everywhere.',
  },
];

const users = [
  ['🛒', 'Retail & Wholesale', 'Quote stock, mixed baskets, and delivery charges with per-item discounts.'],
  ['📡', 'IT & CCTV Suppliers', 'List equipment, labour, and optional warranties in one professional document.'],
  ['🏗️', 'Contractors', 'Capture scope, validity dates, and payment terms before work starts.'],
  ['💼', 'Freelancers & Agencies', 'Send branded quotes without opening a spreadsheet.'],
  ['🪑', 'Furniture & Textiles', 'Combine product lines, quantities, and notes for custom orders.'],
  ['📋', 'Procurement Teams', 'Standardize incoming quotes with a clean, printable layout.'],
];

export function HomePage() {
  return (
    <>
      <SEO 
        title="Free Quotation Generator & Online Quotation Maker"
        description="Create professional business quotations and PDF estimates online for free. Tailored for Sri Lankan businesses (LKR) and global trade. Instant download, no signup required."
        canonical="/"
        keywords={[
          'free quotation generator',
          'online quotation maker',
          'business quotation template',
          'quotation PDF generator',
          'quotation format Sri Lanka',
          'LKR quotation generator',
          'service quotation template',
          'supplier quotation format',
          'quotation maker for small businesses'
        ]}
        schema={[webAppSchema]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div>
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                <span className="hero-badge-text">Free · No sign-up required</span>
              </div>

              <h1>
                Create professional<br />
                <span className="accent">quotations</span> in minutes
              </h1>

              <p className="lead">
                QuoteWork Pro helps Sri Lankan businesses, freelancers, contractors, and suppliers
                prepare clear, accurate quotations without accounting software. Add your details,
                calculate totals in LKR, preview, print, or download a PDF.
              </p>

              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" to="/create">
                  ✦ Create a quotation
                </Link>
                <Link className="btn btn-ghost btn-lg" to="/how-it-works">
                  See how it works →
                </Link>
              </div>

              <div className="trust-strip">
                {[
                  'No account needed',
                  'LKR & 7 currencies',
                  'PDF export',
                  'Data stays on your device',
                ].map((t) => (
                  <div className="trust-item" key={t}>
                    <span className="trust-check">✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Hero card ── */}
            <aside aria-hidden="true">
              <div className="hero-card">
                <div className="hero-card-header">
                  <div>
                    <div className="hero-card-title">Quotation</div>
                    <div className="hero-card-number">QT-20261024-5182</div>
                  </div>
                  <div className="hero-card-badge">Valid 14 days</div>
                </div>

                <div className="hero-card-body">
                  <div className="mini-line">
                    <div>
                      <div className="mini-line-name">CCTV Camera System ×4</div>
                      <div className="mini-line-sub">Hikvision 4MP, outdoor</div>
                    </div>
                    <div className="mini-line-num">Rs. 68,000</div>
                  </div>
                  <div className="mini-line">
                    <div>
                      <div className="mini-line-name">DVR + HDD (2TB)</div>
                      <div className="mini-line-sub">8-channel recorder</div>
                    </div>
                    <div className="mini-line-num">Rs. 22,500</div>
                  </div>
                  <div className="mini-line">
                    <div>
                      <div className="mini-line-name">Installation & cabling</div>
                      <div className="mini-line-sub">5% discount applied</div>
                    </div>
                    <div className="mini-line-num">Rs. 9,975</div>
                  </div>
                  <div className="hero-card-total">
                    <div className="hero-card-total-label">Total (LKR)</div>
                    <div className="hero-card-total-amount">Rs. 100,475.00</div>
                  </div>
                </div>

                <div className="hero-card-footer">
                  <span>📅 24 Oct 2026</span>
                  <span>🏢 SecureTech Solutions</span>
                  <span>✓ PDF ready</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--line)', padding: '28px 0' }}>
        <div className="container">
          <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { value: '100%', label: 'Free to use' },
              { value: 'LKR+', label: '8 currencies supported' },
              { value: '0', label: 'Data sent to servers' },
              { value: '∞', label: 'Quotations you can create' },
            ].map(({ value, label }) => (
              <div className="stat-card" key={label}>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="page" style={{ paddingTop: 56 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-label">Features</div>
            <h2>Everything you need to quote professionally</h2>
            <p className="section-lead">
              No spreadsheet juggling. No PDF headaches. Just fill in the form and your
              quotation is ready.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon, iconClass, title, desc }) => (
              <article className="feature-card" key={title}>
                <div className={`feature-icon ${iconClass}`}>{icon}</div>
                <h3>{title}</h3>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-label">Who it's for</div>
            <h2>Built for Sri Lankan businesses</h2>
            <p className="section-lead">
              From small retail shops in Colombo to contractors in Kandy — QuoteWork Pro works for every sector.
            </p>
          </div>
          <div className="feature-grid">
            {users.map(([icon, title, desc]) => (
              <article className="feature-card card-hover" key={String(title)}>
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{icon}</div>
                <h3>{String(title)}</h3>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{String(desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quotation Guides & Resources ───────────────────── */}
      <section style={{ padding: '64px 0', background: 'var(--bg-subtle, #f8fafc)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
            <div>
              <div className="section-label">Knowledge Hub</div>
              <h2>Quotation Guides & Business Resources</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Practical advice on quotation formats in Sri Lanka, discount calculations, terms, and winning proposals.
              </p>
            </div>
            <Link to="/guides" className="btn btn-secondary btn-sm">
              View all 8 guides →
            </Link>
          </div>

          <div className="guides-grid">
            {GUIDES.slice(0, 3).map((guide) => (
              <article key={guide.slug} className="guide-card">
                <div className="guide-card-header">
                  <span className="guide-card-category">{guide.category}</span>
                  <span className="guide-card-meta">{guide.readTime}</span>
                </div>
                <h3 className="guide-card-title">
                  <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                </h3>
                <p className="guide-card-excerpt">{guide.metaDescription}</p>
                <div className="guide-card-footer">
                  <span className="guide-card-date">{guide.updatedDate}</span>
                  <Link to={`/guides/${guide.slug}`} className="guide-card-link">
                    Read Guide →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{
        padding: '72px 0',
        background: 'linear-gradient(135deg, var(--navy), var(--navy-mid))',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Get started now
          </div>
          <h2 style={{ color: 'white', marginBottom: 12 }}>Ready to create your first quotation?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 28, fontSize: '1.05rem' }}>
            Free forever. No account. No data collected. Your quotation stays on your device.
          </p>
          <Link className="btn btn-accent btn-lg" to="/create">
            ✦ Create a quotation now
          </Link>
        </div>
      </section>
    </>
  );
}
