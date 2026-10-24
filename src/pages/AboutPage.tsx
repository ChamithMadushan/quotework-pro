import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function AboutPage() {
  return (
    <section className="page">
      <SEO 
        title="About QuoteWork Pro | Free Quotation Maker Built for Sri Lanka & Global Business"
        description="QuoteWork Pro was built to give SMEs, contractors, and freelancers a simple, privacy-first quotation creation tool without subscriptions or complex software."
        canonical="/about"
      />
      <div className="container">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <div style={{ marginBottom: 36 }}>
            <div className="section-label">About QuoteWork Pro</div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '0 0 16px' }}>
              A simple, honest tool for Sri Lankan businesses
            </h1>
            <p className="lead">
              QuoteWork Pro was built because creating a professional quotation should not require
              expensive software, a monthly subscription, or a cloud account.
            </p>
          </div>

          <div className="about-grid" style={{ marginBottom: 40 }}>
            <div className="panel">
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🎯</div>
              <h3>Our goal</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.75 }}>
                To give every small business, freelancer, and contractor a fast, accurate, and
                professional way to create and send quotations — without a spreadsheet or an
                accounting package.
              </p>
            </div>
            <div className="panel">
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🇱🇰</div>
              <h3>Built for Sri Lanka first</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.75 }}>
                LKR is the default currency. The product vocabulary and defaults reflect
                the Sri Lankan market. Other currencies are supported for businesses that
                quote internationally.
              </p>
            </div>
            <div className="panel">
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🔒</div>
              <h3>Privacy first</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.75 }}>
                No data is ever sent to a server. Your business information, customer details,
                and quotation content stay entirely in your browser. There is no analytics tracker
                and no account system.
              </p>
            </div>
            <div className="panel">
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>⚖️</div>
              <h3>Honest about limits</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.75 }}>
                QuoteWork Pro produces quotations — not tax invoices, not official receipts. Every
                document includes a clear disclaimer. We do not provide legal or tax advice.
              </p>
            </div>
          </div>

          {/* Principles */}
          <div className="panel" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.3rem', margin: '0 0 20px' }}>Product principles</h2>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'The basic quotation generator stays free forever.',
                'No account is required to create or download quotations.',
                'Calculations are performed accurately using integer arithmetic to avoid rounding errors.',
                'Optional fields are clearly labelled. We never prefill information we don\'t have.',
                'The interface is designed for non-technical users.',
                'We never invent business, customer, tax, or pricing information.',
                'All important buttons are functional and clearly labelled.',
              ].map((p) => (
                <li key={p} style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.7 }}>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <Link className="btn btn-primary btn-lg" to="/create">
              Create a quotation now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
