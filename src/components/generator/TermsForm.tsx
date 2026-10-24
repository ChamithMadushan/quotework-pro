import { useQuotation } from '../../context/QuotationContext';
import { Field } from '../Field';

export function TermsForm() {
  const { quotation, updateQuotation } = useQuotation();

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Payment, delivery &amp; notes</h2>
          <p className="panel-subtitle">All fields are optional and appear in the quotation footer.</p>
        </div>
      </div>

      <div className="form-grid">
        <Field id="payment" label="Payment terms" optional>
          <textarea
            id="payment"
            value={quotation.paymentTerms}
            onChange={(e) => updateQuotation((current) => ({ ...current, paymentTerms: e.target.value }))}
            placeholder="e.g. 50% advance, balance before delivery"
          />
        </Field>

        <Field id="delivery" label="Delivery information" optional>
          <textarea
            id="delivery"
            value={quotation.deliveryInfo}
            onChange={(e) => updateQuotation((current) => ({ ...current, deliveryInfo: e.target.value }))}
            placeholder="e.g. 10–14 working days after order confirmation"
          />
        </Field>

        <Field id="notes" label="Notes" optional className="span-2">
          <textarea
            id="notes"
            value={quotation.notes}
            onChange={(e) => updateQuotation((current) => ({ ...current, notes: e.target.value }))}
            placeholder="Any additional notes for the customer…"
          />
        </Field>

        <Field
          id="terms"
          label="Terms &amp; conditions"
          optional
          className="span-2"
          hint="QuoteWork Pro includes a default disclaimer. Edit or clear as needed."
        >
          <textarea
            id="terms"
            style={{ minHeight: 120 }}
            value={quotation.terms}
            onChange={(e) => updateQuotation((current) => ({ ...current, terms: e.target.value }))}
          />
        </Field>

        <div className="field span-2">
          <label className={`toggle-row${quotation.showSignature ? ' active' : ''}`} style={{ padding: '12px 16px' }}>
            <div>
              <div className="toggle-label" style={{ fontWeight: 600 }}>Include authorized signature area</div>
              <div className="toggle-hint">Adds sign-off line, signature block, and date line on the PDF and print export</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={quotation.showSignature ?? true}
                onChange={(e) =>
                  updateQuotation((current) => ({
                    ...current,
                    showSignature: e.target.checked,
                  }))
                }
              />
              <span className="switch-slider" />
            </label>
          </label>
        </div>

        {quotation.showSignature ? (
          <Field id="sig-title" label="Signature title" optional className="span-2" hint="Label printed below the signature line">
            <input
              id="sig-title"
              className="input-text"
              value={quotation.signatureTitle ?? 'Authorized Signature'}
              onChange={(e) =>
                updateQuotation((current) => ({
                  ...current,
                  signatureTitle: e.target.value,
                }))
              }
              placeholder="e.g. Authorized Signature & Stamp"
            />
          </Field>
        ) : null}
      </div>
    </section>
  );
}
