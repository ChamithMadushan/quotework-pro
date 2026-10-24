import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QuotationPreview } from '../components/QuotationPreview';
import { useQuotation } from '../context/QuotationContext';
import { downloadQuotationPdf } from '../lib/pdf';
import { validateQuotation } from '../lib/validation';
import { SEO } from '../components/SEO';

export function PreviewPage() {
  const { quotation, totals, setBanner, banner } = useQuotation();
  const [busy, setBusy] = useState(false);
  const errors = validateQuotation(quotation);
  const invalid = Object.keys(errors).length > 0;

  async function onDownload() {
    setBusy(true);
    try {
      await downloadQuotationPdf(quotation, totals, `${quotation.number || 'quotation'}.pdf`);
      setBanner(`✓ PDF downloaded: ${quotation.number || 'quotation'}.pdf`);
    } catch {
      setBanner('Could not create the PDF. Try using the Print option instead.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page">
      <SEO 
        title="Quotation Preview & PDF Export | QuoteWork Pro"
        description="Preview your finished business quotation in A4 format. Review line items, calculate totals, and download or print high-quality PDF documentation."
        canonical="/preview"
      />
      <div className="container">
        <div className="toolbar no-print">
          <div className="toolbar-left">
            <p className="kicker">Preview</p>
            <h1 style={{ fontSize: '1.4rem' }}>{quotation.number || 'Quotation preview'}</h1>
          </div>
          <div className="toolbar-actions">
            <a
              href="/Sample_Quotation_LKR.pdf"
              download="Sample_Quotation_LKR.pdf"
              className="btn btn-ghost btn-sm"
              title="Download pre-generated sample PDF document"
            >
              📄 Sample PDF
            </a>
            <Link className="btn btn-ghost btn-sm" to="/create">
              ✏️ Edit quotation
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => window.print()}
              disabled={busy}
            >
              🖨 Print
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onDownload}
              disabled={busy}
              title="Download this quotation as A4 PDF"
            >
              {busy ? '⏳ Preparing PDF…' : '📥 Download PDF'}
            </button>
          </div>
        </div>

        {banner && (
          <div className={`banner ${banner.toLowerCase().includes('complete') || banner.toLowerCase().includes('could not') ? 'banner-error' : 'banner-ok'}`} role="status">
            <span className="banner-icon">{banner.toLowerCase().includes('error') || banner.toLowerCase().includes('complete') ? '⚠️' : '✓'}</span>
            {banner}
          </div>
        )}

        {invalid && (
          <div className="banner banner-warn" role="alert">
            <span className="banner-icon">⚠️</span>
            This quotation is missing required details (business name, customer, or items).
            <Link to="/create" style={{ marginLeft: 8, fontWeight: 700, textDecoration: 'underline' }}>
              Edit now →
            </Link>
          </div>
        )}

        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <QuotationPreview quotation={quotation} totals={totals} />
        </div>
      </div>
    </section>
  );
}
