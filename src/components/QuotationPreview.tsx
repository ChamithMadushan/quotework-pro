import { formatMoney } from '../lib/currency';
import { formatDisplayDate } from '../lib/ids';
import type { Quotation, QuotationTotals } from '../types/quotation';

interface Props {
  quotation: Quotation;
  totals: QuotationTotals;
}

export function QuotationPreview({ quotation, totals }: Props) {
  const sender   = quotation.business.name  || 'Your Business';
  const customer = quotation.customer.company || quotation.customer.name || 'Customer';
  const hasItems = quotation.items.some((i) => i.description.trim());

  return (
    <article className="quote-sheet" id="quotation-sheet" aria-label="Quotation preview">

      {/* ── Header ──────────────────────────────────────── */}
      <header className="quote-header">
        <div>
          {quotation.business.logoDataUrl ? (
            <img className="quote-logo" src={quotation.business.logoDataUrl} alt="" />
          ) : null}
          <div className={`quote-biz-name${quotation.business.logoDataUrl ? '' : ''}`}>
            {sender}
          </div>
          {(quotation.business.address || quotation.business.city) && (
            <div className="quote-biz-detail">
              {[quotation.business.address, quotation.business.city].filter(Boolean).join(', ')}
            </div>
          )}
          {(quotation.business.phone || quotation.business.email) && (
            <div className="quote-biz-detail">
              {[quotation.business.phone, quotation.business.email].filter(Boolean).join(' · ')}
            </div>
          )}
          {quotation.business.website && (
            <div className="quote-biz-detail">{quotation.business.website}</div>
          )}
          {quotation.business.taxId && (
            <div className="quote-biz-detail">Tax/Reg ID: {quotation.business.taxId}</div>
          )}
        </div>

        <div className="quote-meta-block">
          <div className="quote-title">Quotation</div>
          <div className="quote-number">{quotation.number || 'QT-pending'}</div>
          <div className="quote-meta-detail">
            <div>Date: {formatDisplayDate(quotation.date)}</div>
            {quotation.validUntil && (
              <div>Valid until: {formatDisplayDate(quotation.validUntil)}</div>
            )}
            <div>Currency: {quotation.currency}</div>
            {quotation.projectReference && (
              <div style={{ marginTop: 2, fontWeight: 600 }}>Ref: {quotation.projectReference}</div>
            )}
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="quote-body">

        {/* Parties */}
        <div className="quote-parties">
          <div>
            <div className="quote-party-label">Prepared for</div>
            <div className="quote-party-name">{customer}</div>
            {quotation.customer.name && quotation.customer.company && (
              <div className="quote-party-detail">{quotation.customer.name}</div>
            )}
            {(quotation.customer.address || quotation.customer.city) && (
              <div className="quote-party-detail">
                {[quotation.customer.address, quotation.customer.city].filter(Boolean).join(', ')}
              </div>
            )}
            {(quotation.customer.phone || quotation.customer.email) && (
              <div className="quote-party-detail">
                {[quotation.customer.phone, quotation.customer.email].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
          <div>
            <div className="quote-party-label">From</div>
            <div className="quote-party-name">{sender}</div>
            <span className="quote-not-invoice">Quotation — not an invoice or tax receipt</span>
          </div>
        </div>

        {/* Items table */}
        {hasItems ? (
          <table className="quote-table">
            <thead>
              <tr>
                <th style={{ width: '42%' }}>Description</th>
                <th className="r" style={{ width: '8%' }}>Qty</th>
                <th className="r" style={{ width: '16%' }}>Unit price</th>
                <th className="r" style={{ width: '14%' }}>Discount</th>
                <th className="r" style={{ width: '20%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item) => {
                if (!item.description.trim()) return null;
                const line = totals.lines.find((entry) => entry.id === item.id);
                const discountLabel =
                  item.discountType === 'percent'
                    ? `${item.discountValue}%`
                    : item.discountType === 'amount'
                    ? formatMoney(item.discountValue, quotation.currency)
                    : '—';
                return (
                  <tr key={item.id}>
                    <td><span className="item-desc">{item.description}</span></td>
                    <td className="r">{item.quantity}</td>
                    <td className="r">{formatMoney(item.unitPrice, quotation.currency)}</td>
                    <td className="r" style={{ color: 'var(--ok-dark, var(--ok))' }}>{discountLabel}</td>
                    <td className="r" style={{ fontWeight: 700 }}>
                      {formatMoney(line?.net ?? 0, quotation.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="quote-empty-state">
            <div className="quote-empty-icon">📋</div>
            <div>Line items will appear here once you add descriptions in the form.</div>
          </div>
        )}

        {/* Totals */}
        <div className="quote-totals">
          <div className="quote-totals-inner">
            {totals.itemDiscounts > 0 && (
              <div className="quote-totals-row">
                <span className="quote-totals-label">Item discounts</span>
                <span className="quote-totals-amount" style={{ color: 'var(--ok)' }}>
                  −{formatMoney(totals.itemDiscounts, quotation.currency)}
                </span>
              </div>
            )}
            <div className="quote-totals-row">
              <span className="quote-totals-label">Subtotal</span>
              <span className="quote-totals-amount">{formatMoney(totals.subtotal, quotation.currency)}</span>
            </div>
            {totals.documentDiscount > 0 && (
              <div className="quote-totals-row">
                <span className="quote-totals-label">
                  Discount{quotation.documentDiscount.type === 'percent' ? ` (${quotation.documentDiscount.value}%)` : ''}
                </span>
                <span className="quote-totals-amount" style={{ color: 'var(--ok)' }}>
                  −{formatMoney(totals.documentDiscount, quotation.currency)}
                </span>
              </div>
            )}
            {quotation.tax.enabled && (
              <div className="quote-totals-row">
                <span className="quote-totals-label">
                  {quotation.tax.name || 'Tax'} {quotation.tax.rate}%
                  {quotation.tax.inclusive ? ' (incl.)' : ''}
                </span>
                <span className="quote-totals-amount">{formatMoney(totals.tax, quotation.currency)}</span>
              </div>
            )}
            {totals.additionalCharges > 0 && (
              <div className="quote-totals-row">
                <span className="quote-totals-label">{quotation.additionalChargesLabel || 'Additional charges'}</span>
                <span className="quote-totals-amount">+{formatMoney(totals.additionalCharges, quotation.currency)}</span>
              </div>
            )}
            <div className="quote-totals-row grand">
              <span className="quote-totals-label">Total ({quotation.currency})</span>
              <span className="quote-totals-amount">{formatMoney(totals.total, quotation.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes / Terms grid */}
        {(quotation.paymentTerms || quotation.deliveryInfo || quotation.notes || quotation.terms) && (
          <div className="quote-notes">
            {quotation.paymentTerms && (
              <div className="quote-notes-item">
                <strong>Payment terms</strong>
                <p>{quotation.paymentTerms}</p>
              </div>
            )}
            {quotation.deliveryInfo && (
              <div className="quote-notes-item">
                <strong>Delivery &amp; completion</strong>
                <p>{quotation.deliveryInfo}</p>
              </div>
            )}
            {quotation.notes && (
              <div className="quote-notes-item full">
                <strong>Notes</strong>
                <p>{quotation.notes}</p>
              </div>
            )}
            {quotation.terms && (
              <div className="quote-notes-item full">
                <strong>Terms &amp; conditions</strong>
                <p>{quotation.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Signature Area */}
        {quotation.showSignature !== false && (
          <div className="quote-signature-grid">
            <div className="quote-signature-box">
              <div className="quote-signature-line" />
              <div className="quote-signature-title">{quotation.signatureTitle || 'Authorized Signature'}</div>
              <div className="quote-signature-sub">{sender}</div>
            </div>
            <div className="quote-signature-box">
              <div className="quote-signature-line" />
              <div className="quote-signature-title">Client Acceptance &amp; Date</div>
              <div className="quote-signature-sub">{customer}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="quote-footer">
        <span className="quote-footer-disclaimer">
          This is a quotation only, not a tax invoice or receipt. Prices are subject to change after the validity date.
          Confirm tax treatment with a qualified advisor before issuing invoices.
        </span>
        <span style={{ whiteSpace: 'nowrap', opacity: 0.6, fontSize: '0.7rem' }}>
          QuoteWork Pro
        </span>
      </div>
    </article>
  );
}
