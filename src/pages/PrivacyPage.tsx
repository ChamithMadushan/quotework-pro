import { SEO } from '../components/SEO';

export function PrivacyPage() {
  return (
    <section className="page">
      <SEO 
        title="Privacy Policy | QuoteWork Pro Quotation Maker"
        description="QuoteWork Pro privacy policy: We operate a privacy-first quotation creation tool where all documents and drafts are stored securely on your local device."
        canonical="/privacy"
      />
      <div className="container">
        <div className="legal-page">
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Legal</div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: '0 0 12px' }}>Privacy Policy</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Last updated: October 2026</p>
          </div>

          <div className="panel" style={{ marginBottom: 24, background: 'var(--ok-bg)', border: '1px solid var(--ok-border)' }}>
            <strong style={{ color: 'var(--ok)', display: 'flex', gap: 8, alignItems: 'center' }}>
              🔒 Short version:
            </strong>
            <p style={{ margin: '8px 0 0', color: 'var(--ok)', fontSize: '0.93rem' }}>
              QuoteWork Pro stores all data locally in your browser only. No personal data is collected,
              transmitted, or stored on any server. There are no cookies, trackers, or analytics.
            </p>
          </div>

          <h2>1. What data we collect</h2>
          <p>
            QuoteWork Pro does not collect any personal data. The tool runs entirely in your browser.
            No information you enter into the form — including your business name, customer details,
            or quotation content — is ever sent to a server.
          </p>

          <h2>2. Local storage</h2>
          <p>
            QuoteWork Pro uses your browser's <code>localStorage</code> to:
          </p>
          <ul>
            <li>Auto-save your current quotation so you don't lose your work if you close the tab.</li>
            <li>Save up to 20 named drafts so you can return to previous quotations.</li>
          </ul>
          <p>
            This data is stored only on your device. You can clear it at any time by clearing your
            browser's site data for this website, or by using the "Reset form" button.
          </p>

          <h2>3. Cookies and tracking</h2>
          <p>
            QuoteWork Pro does not use cookies, tracking pixels, analytics scripts, or advertising
            networks. There are no third-party services embedded in this website.
          </p>

          <h2>4. PDF generation</h2>
          <p>
            PDF files are generated entirely in your browser using the open-source jsPDF and
            html2canvas libraries. The generated file is saved directly to your device.
            Nothing is uploaded to any server during this process.
          </p>

          <h2>5. Logo uploads</h2>
          <p>
            When you upload a logo image, it is resized and stored as a data URL inside
            localStorage on your device only. The image is not uploaded to any server.
          </p>

          <h2>6. External resources</h2>
          <p>
            QuoteWork Pro loads fonts from Google Fonts (<code>fonts.googleapis.com</code>).
            This means your browser makes a request to Google's servers to download the font files.
            Google's privacy policy applies to these requests. No other external resources are loaded.
          </p>

          <h2>7. Children</h2>
          <p>
            QuoteWork Pro is a business productivity tool intended for adults. It is not directed at
            children under the age of 13.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            If this policy changes materially, the "Last updated" date at the top of this page will
            be updated. Continued use of the tool after a policy change constitutes acceptance.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have questions about this privacy policy, you can contact the QuoteWork Pro team
            through the website's contact information.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '28px 0' }} />

          <div className="panel" style={{ background: 'var(--warn-bg)', border: '1px solid rgba(180,83,9,0.2)' }}>
            <strong style={{ color: 'var(--warn)' }}>⚠ Disclaimer</strong>
            <p style={{ margin: '8px 0 0', color: 'var(--warn)', fontSize: '0.88rem' }}>
              QuoteWork Pro is a free quotation worksheet tool. It is not accounting software, and it
              does not provide legal, tax, or financial advice. Documents produced by QuoteWork Pro are
              quotations only — not tax invoices or official receipts. Confirm tax and invoicing
              obligations with a qualified accountant or legal advisor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
