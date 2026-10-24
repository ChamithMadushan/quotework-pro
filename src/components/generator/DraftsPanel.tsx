import { useQuotation } from '../../context/QuotationContext';
import { summarizeDraft } from '../../lib/storage';
import { formatMoney } from '../../lib/currency';

function timeAgo(isoDate: string): string {
  try {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch {
    return '';
  }
}

export function DraftsPanel() {
  const {
    drafts,
    loadDraft,
    removeDraft,
    dbQuotations,
    isDbConnected,
    loadFromDb,
    deleteFromDb,
    updateStatusInDb,
    saveToDb,
  } = useQuotation();

  return (
    <section className="panel">
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="panel-title">Quotation database &amp; drafts</h2>
          <p className="panel-subtitle">Manage quotations saved in SQLite database and local drafts.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: isDbConnected ? 'rgba(14, 169, 138, 0.12)' : 'rgba(234, 88, 12, 0.12)', color: isDbConnected ? 'var(--teal-dark, #0ea98a)' : '#ea580c', fontWeight: 600 }}>
          <span>{isDbConnected ? '🟢' : '🟠'}</span>
          <span>{isDbConnected ? 'Database Connected' : 'Local Storage Mode'}</span>
        </div>
      </div>

      {/* ── SQLite Database Quotations ────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--navy)' }}>
            🗄️ Database records ({dbQuotations.length})
          </h3>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => saveToDb('draft')}
            title="Save current quotation to SQLite database"
          >
            💾 Save to database
          </button>
        </div>

        {dbQuotations.length === 0 ? (
          <div className="draft-empty" style={{ padding: 18 }}>
            <div style={{ fontSize: '0.85rem' }}>No database quotations yet. Click <strong>Save to database</strong> to record one!</div>
          </div>
        ) : (
          <div className="draft-list">
            {dbQuotations.map((quote) => {
              const statusColor =
                quote.status === 'accepted'
                  ? 'var(--ok, #16a34a)'
                  : quote.status === 'declined'
                  ? '#dc2626'
                  : quote.status === 'sent'
                  ? 'var(--teal, #0ea98a)'
                  : '#64748b';

              return (
                <div className="draft-item" key={quote.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="draft-number">{quote.number}</span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: `${statusColor}18`,
                          color: statusColor,
                          border: `1px solid ${statusColor}33`,
                        }}
                      >
                        {quote.status}
                      </span>
                    </div>
                    <div className="draft-parties">
                      <strong>{quote.customerName}</strong>
                      {quote.projectReference ? ` · ${quote.projectReference}` : ''}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)', marginTop: 2 }}>
                      {formatMoney(quote.grandTotal, quote.currency)}
                      <span style={{ fontWeight: 400, color: 'var(--muted)', marginLeft: 8 }}>
                        {quote.date} · {timeAgo(quote.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="draft-actions">
                    <select
                      value={quote.status}
                      onChange={(e) => updateStatusInDb(quote.id, e.target.value as any)}
                      style={{ fontSize: '0.78rem', padding: '4px 6px', height: 'auto', borderRadius: 4 }}
                      title="Update status in database"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                    </select>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => loadFromDb(quote.id)}
                      title="Load this quotation from database into the form"
                    >
                      Load
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`Delete quotation ${quote.number} from database?`)) {
                          deleteFromDb(quote.id);
                        }
                      }}
                      title="Delete from database"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Browser Local Storage Drafts ───────────────── */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: 'var(--muted)' }}>
          📱 Browser local storage drafts ({drafts.length})
        </h3>
        {drafts.length === 0 ? (
          <div className="draft-empty" style={{ padding: 12 }}>
            <div style={{ fontSize: '0.8rem' }}>No local browser drafts.</div>
          </div>
        ) : (
          <div className="draft-list">
            {drafts.map((draft) => {
              const summary = summarizeDraft(draft);
              return (
                <div className="draft-item" key={draft.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="draft-number">{summary.number}</div>
                    <div className="draft-parties">
                      {summary.businessName} → {summary.customerName}
                    </div>
                    <div className="draft-time">Saved {timeAgo(draft.updatedAt)}</div>
                  </div>
                  <div className="draft-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => loadDraft(draft.id)}
                      title="Load this draft"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`Delete draft ${summary.number}?`)) removeDraft(draft.id);
                      }}
                      title="Delete this draft"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
