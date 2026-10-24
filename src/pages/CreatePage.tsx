import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BusinessForm } from '../components/generator/BusinessForm';
import { CustomerForm } from '../components/generator/CustomerForm';
import { DraftsPanel } from '../components/generator/DraftsPanel';
import { ItemsForm } from '../components/generator/ItemsForm';
import { MetaForm } from '../components/generator/MetaForm';
import { TermsForm } from '../components/generator/TermsForm';
import { TotalsForm } from '../components/generator/TotalsForm';
import { QuotationPreview } from '../components/QuotationPreview';
import { useQuotation } from '../context/QuotationContext';
import { downloadQuotationPdf } from '../lib/pdf';
import { SEO } from '../components/SEO';

const bannerIcon = (msg: string) => {
  const lower = msg.toLowerCase();
  if (lower.includes('complete') || lower.includes('could not') || lower.includes('required') || lower.includes('error')) return '⚠️';
  if (lower.includes('draft') || lower.includes('saved')) return '💾';
  if (lower.includes('pdf') || lower.includes('download')) return '📥';
  if (lower.includes('reset')) return '🔄';
  return '✓';
};

const bannerClass = (msg: string) => {
  const lower = msg.toLowerCase();
  if (lower.includes('complete') || lower.includes('could not') || lower.includes('required') || lower.includes('error')) return 'banner banner-error';
  return 'banner banner-ok';
};

export function CreatePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'form' | 'preview'>('form');
  const [busy, setBusy] = useState(false);
  const { quotation, totals, banner, setBanner, persistDraft, resetQuotation, loadSample, saveToDb, isDbConnected } = useQuotation();

  async function onDownload() {
    setBusy(true);
    try {
      // Auto-save to DB when downloading PDF
      if (isDbConnected) {
        saveToDb('sent').catch(() => {});
      }
      await downloadQuotationPdf(quotation, totals, `${quotation.number || 'quotation'}.pdf`);
      setBanner(`✓ PDF downloaded: ${quotation.number || 'quotation'}.pdf (Saved to Database)`);
    } catch {
      setBanner('Could not create the PDF. Try print instead.');
    } finally {
      setBusy(false);
    }
  }

  function onReset() {
    if (window.confirm('Reset the form? This will clear all fields and generate a new quotation number.')) {
      resetQuotation();
    }
  }

  return (
    <section className="page">
      <SEO 
        title="Create Quotation Online | Free Quotation Maker & PDF Generator"
        description="Build a customized business quotation with company logo, itemized pricing, LKR or foreign currency, line discounts, VAT calculations, and instant PDF download."
        canonical="/create"
        keywords={[
          'online quotation maker',
          'free quotation generator',
          'LKR quotation generator',
          'quotation PDF generator',
          'business quotation template',
          'service quotation template'
        ]}
      />
      <div className="container">
        {/* ── Toolbar ─────────────────────────────────────── */}
        <div className="toolbar no-print">
          <div className="toolbar-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p className="kicker" style={{ margin: 0 }}>Generator</p>
              <span style={{ fontSize: '0.72rem', padding: '1px 6px', borderRadius: 4, background: isDbConnected ? 'rgba(14, 169, 138, 0.15)' : 'rgba(234, 88, 12, 0.15)', color: isDbConnected ? 'var(--teal-dark, #0ea98a)' : '#ea580c', fontWeight: 700 }}>
                {isDbConnected ? '🟢 SQLite DB' : '🟠 Local Mode'}
              </span>
            </div>
            <h1>Create quotation</h1>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={loadSample}
              title="Pre-fill with realistic Sri Lankan sample data"
            >
              ⚡ Load sample
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => saveToDb('draft')}
              title="Save directly to backend SQLite database"
            >
              🗄️ Save to DB
            </button>
            <a
              href="/Sample_Quotation_LKR.pdf"
              download="Sample_Quotation_LKR.pdf"
              className="btn btn-ghost btn-sm"
              title="Download pre-generated sample PDF document"
            >
              📄 Sample PDF
            </a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={persistDraft} title="Save as draft in this browser">
              💾 Save draft
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/preview')} title="Open full-page preview">
              👁 Full preview
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()} disabled={busy} title="Print this quotation">
              🖨 Print
            </button>
            <button type="button" className="btn btn-primary" onClick={onDownload} disabled={busy}>
              {busy ? '⏳ Preparing PDF…' : '📥 Download PDF'}
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={onReset} title="Clear and start a new quotation">
              Reset
            </button>
          </div>
        </div>

        {/* ── Banner ──────────────────────────────────────── */}
        {banner ? (
          <div className={bannerClass(banner)} role="status">
            <span className="banner-icon">{bannerIcon(banner)}</span>
            <span>{banner}</span>
            <button
              type="button"
              onClick={() => setBanner(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, fontSize: '1rem' }}
              aria-label="Dismiss"
            >✕</button>
          </div>
        ) : null}

        {/* ── Mobile tab switcher ─────────────────────────── */}
        <div className="mobile-tabs no-print">
          <button type="button" className={`tab-btn${tab === 'form' ? ' active' : ''}`} onClick={() => setTab('form')}>
            📝 Form
          </button>
          <button type="button" className={`tab-btn${tab === 'preview' ? ' active' : ''}`} onClick={() => setTab('preview')}>
            👁 Preview
          </button>
        </div>

        {/* ── Workspace ───────────────────────────────────── */}
        <div className="workspace" data-tab={tab}>
          <div className="form-pane">
            <MetaForm />
            <BusinessForm />
            <CustomerForm />
            <ItemsForm />
            <TotalsForm />
            <TermsForm />
            <DraftsPanel />
          </div>

          <aside className="preview-pane">
            <div className="preview-wrap">
              {/* Preview actions above the sheet */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }} className="no-print">
                <Link to="/preview" className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Open full preview
                </Link>
                <button type="button" className="btn btn-accent btn-sm" onClick={onDownload} disabled={busy} style={{ flex: 1 }}>
                  {busy ? 'Preparing…' : '📥 PDF'}
                </button>
              </div>
              <QuotationPreview quotation={quotation} totals={totals} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
