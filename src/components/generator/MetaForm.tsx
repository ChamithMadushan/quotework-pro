import { useQuotation } from '../../context/QuotationContext';
import { CURRENCIES } from '../../lib/currency';
import { Field, inputClass } from '../Field';

export function MetaForm() {
  const { quotation, updateQuotation, errors, regenerateNumber } = useQuotation();

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Quotation details</h2>
          <p className="panel-subtitle">Reference number, dates, and currency.</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={regenerateNumber}
          title="Generate a new unique quotation number"
        >
          🔄 New number
        </button>
      </div>

      <div className="form-grid">
        <Field id="quote-number" label="Quotation number *" error={errors.number}>
          <input
            id="quote-number"
            className={inputClass(errors.number)}
            value={quotation.number}
            onChange={(e) => updateQuotation((current) => ({ ...current, number: e.target.value }))}
            placeholder="e.g. QT-20261024-1234"
          />
        </Field>

        <Field id="currency" label="Currency">
          <select
            id="currency"
            value={quotation.currency}
            onChange={(e) => updateQuotation((current) => ({ ...current, currency: e.target.value }))}
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.label}
              </option>
            ))}
          </select>
        </Field>

        <Field id="quote-date" label="Quotation date *" error={errors.date}>
          <input
            id="quote-date"
            type="date"
            className={inputClass(errors.date)}
            value={quotation.date}
            onChange={(e) => updateQuotation((current) => ({ ...current, date: e.target.value }))}
          />
        </Field>

        <Field id="valid-until" label="Valid until" optional error={errors.validUntil} hint="Leave blank if there is no expiry date.">
          <input
            id="valid-until"
            type="date"
            className={inputClass(errors.validUntil)}
            value={quotation.validUntil}
            onChange={(e) => updateQuotation((current) => ({ ...current, validUntil: e.target.value }))}
          />
        </Field>

        <Field id="project-reference" label="Project / Reference" optional hint="e.g. CCTV Branch Upgrade, PO #8892">
          <input
            id="project-reference"
            className="input-text"
            value={quotation.projectReference ?? ''}
            onChange={(e) => updateQuotation((current) => ({ ...current, projectReference: e.target.value }))}
            placeholder="e.g. Office Security Camera Installation"
          />
        </Field>
      </div>
    </section>
  );
}
