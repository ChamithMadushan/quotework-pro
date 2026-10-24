import { useQuotation } from '../../context/QuotationContext';
import { formatMoney } from '../../lib/currency';
import type { DiscountType } from '../../types/quotation';
import { Field, inputClass } from '../Field';

export function TotalsForm() {
  const { quotation, totals, errors, updateQuotation } = useQuotation();

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Tax &amp; discount</h2>
          <p className="panel-subtitle">Configure optional tax and document-level discounts.</p>
        </div>
      </div>

      {/* Tax toggle */}
      <label
        className={`toggle-row${quotation.tax.enabled ? ' active' : ''}`}
        style={{ marginBottom: 16 }}
      >
        <div style={{ flex: 1 }}>
          <div className="toggle-label">
            Show tax on this quotation
            <span className="toggle-sub"> — e.g. VAT, NBT</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>
            Enable only if your business is registered to collect tax on this transaction.
          </div>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={quotation.tax.enabled}
            onChange={(e) =>
              updateQuotation((current) => ({
                ...current,
                tax: { ...current.tax, enabled: e.target.checked },
              }))
            }
          />
          <span className="switch-slider" />
        </label>
      </label>

      {quotation.tax.enabled ? (
        <div className="form-grid" style={{ marginBottom: 16 }}>
          <Field id="tax-name" label="Tax label" error={errors['tax.name']} hint='e.g. "VAT" or "NBT"'>
            <input
              id="tax-name"
              className={inputClass(errors['tax.name'])}
              value={quotation.tax.name}
              onChange={(e) =>
                updateQuotation((current) => ({ ...current, tax: { ...current.tax, name: e.target.value } }))
              }
              placeholder="VAT"
            />
          </Field>
          <Field id="tax-rate" label="Tax rate (%)" error={errors['tax.rate']}>
            <input
              id="tax-rate"
              type="number"
              min={0}
              max={100}
              step="0.01"
              className={inputClass(errors['tax.rate'])}
              value={quotation.tax.rate}
              onChange={(e) =>
                updateQuotation((current) => ({ ...current, tax: { ...current.tax, rate: Number(e.target.value) } }))
              }
              placeholder="18"
            />
          </Field>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <label className={`toggle-row${quotation.tax.inclusive ? ' active' : ''}`} style={{ padding: '10px 14px' }}>
              <div className="toggle-label" style={{ fontSize: '0.9rem' }}>
                Prices already include tax (tax-inclusive)
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={quotation.tax.inclusive}
                  onChange={(e) =>
                    updateQuotation((current) => ({
                      ...current,
                      tax: { ...current.tax, inclusive: e.target.checked },
                    }))
                  }
                />
                <span className="switch-slider" />
              </label>
            </label>
          </div>
        </div>
      ) : null}

      {/* Document discount */}
      <div className="form-grid" style={{ marginBottom: 0 }}>
        <Field id="doc-discount-type" label="Document discount" optional>
          <select
            id="doc-discount-type"
            value={quotation.documentDiscount.type}
            onChange={(e) =>
              updateQuotation((current) => ({
                ...current,
                documentDiscount: {
                  type: e.target.value as DiscountType,
                  value: e.target.value === 'none' ? 0 : current.documentDiscount.value,
                },
              }))
            }
          >
            <option value="none">No document discount</option>
            <option value="percent">Percentage (%)</option>
            <option value="amount">Fixed amount</option>
          </select>
        </Field>
        {quotation.documentDiscount.type !== 'none' ? (
          <Field id="doc-discount-value" label="Discount value" error={errors['documentDiscount.value']}>
            <input
              id="doc-discount-value"
              type="number"
              min={0}
              step="0.01"
              className={inputClass(errors['documentDiscount.value'])}
              value={quotation.documentDiscount.value}
              onChange={(e) =>
                updateQuotation((current) => ({
                  ...current,
                  documentDiscount: { ...current.documentDiscount, value: Number(e.target.value) },
                }))
              }
              placeholder={quotation.documentDiscount.type === 'percent' ? '0–100' : '0.00'}
            />
          </Field>
        ) : null}
      </div>

      {/* Additional charges */}
      <div className="form-grid" style={{ marginTop: '1rem', marginBottom: 0 }}>
        <Field id="add-charges-label" label="Additional charges label" optional hint="e.g. Delivery, Shipping, Installation">
          <input
            id="add-charges-label"
            className="input-text"
            value={quotation.additionalChargesLabel ?? ''}
            onChange={(e) =>
              updateQuotation((current) => ({
                ...current,
                additionalChargesLabel: e.target.value,
              }))
            }
            placeholder="e.g. Delivery / Shipping fee"
          />
        </Field>
        <Field id="add-charges-amount" label="Additional charges amount" optional hint="Added after taxes to grand total">
          <input
            id="add-charges-amount"
            type="number"
            min={0}
            step="0.01"
            className="input-text"
            value={quotation.additionalCharges || ''}
            onChange={(e) =>
              updateQuotation((current) => ({
                ...current,
                additionalCharges: Number(e.target.value) || 0,
              }))
            }
            placeholder="0.00"
          />
        </Field>
      </div>

      {/* Live totals preview */}
      <div className="totals-card">
        <div className="totals-header">Live total preview</div>
        <div className="totals-body">
          <div className="total-row">
            <span className="total-label">Items gross</span>
            <span className="total-amount">{formatMoney(totals.itemsGross, quotation.currency)}</span>
          </div>
          {totals.itemDiscounts > 0 ? (
            <div className="total-row">
              <span className="total-label">Item discounts</span>
              <span className="total-amount" style={{ color: 'var(--ok)' }}>−{formatMoney(totals.itemDiscounts, quotation.currency)}</span>
            </div>
          ) : null}
          <div className="total-row">
            <span className="total-label">Subtotal</span>
            <span className="total-amount">{formatMoney(totals.subtotal, quotation.currency)}</span>
          </div>
          {totals.documentDiscount > 0 ? (
            <div className="total-row">
              <span className="total-label">
                Document discount{quotation.documentDiscount.type === 'percent' ? ` (${quotation.documentDiscount.value}%)` : ''}
              </span>
              <span className="total-amount" style={{ color: 'var(--ok)' }}>−{formatMoney(totals.documentDiscount, quotation.currency)}</span>
            </div>
          ) : null}
          {quotation.tax.enabled ? (
            <div className="total-row">
              <span className="total-label">
                {quotation.tax.name || 'Tax'} {quotation.tax.rate}%
                {quotation.tax.inclusive ? ' (included)' : ''}
              </span>
              <span className="total-amount">{formatMoney(totals.tax, quotation.currency)}</span>
            </div>
          ) : null}
          {totals.additionalCharges > 0 ? (
            <div className="total-row">
              <span className="total-label">{quotation.additionalChargesLabel || 'Additional charges'}</span>
              <span className="total-amount">+{formatMoney(totals.additionalCharges, quotation.currency)}</span>
            </div>
          ) : null}
          <div className="total-row grand">
            <span className="total-label">Total</span>
            <span className="total-amount">{formatMoney(totals.total, quotation.currency)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
