import { useQuotation } from '../../context/QuotationContext';
import { fileToLogoDataUrl } from '../../lib/logo';
import { Field, inputClass } from '../Field';

export function BusinessForm() {
  const { quotation, updateQuotation, errors, setBanner } = useQuotation();
  const b = quotation.business;

  function patch<K extends keyof typeof b>(key: K, value: (typeof b)[K]) {
    updateQuotation((current) => ({
      ...current,
      business: { ...current.business, [key]: value },
    }));
  }

  async function onLogo(file: File | null) {
    if (!file) {
      patch('logoDataUrl', null);
      return;
    }
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      patch('logoDataUrl', dataUrl);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : 'Could not use that logo.');
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Your business</h2>
          <p className="panel-subtitle">This information appears at the top of every quotation.</p>
        </div>
      </div>

      {/* Logo upload zone */}
      <label
        className={`logo-upload-zone${b.logoDataUrl ? ' has-logo' : ''}`}
        style={{ marginBottom: 18, cursor: 'pointer' }}
        htmlFor="logo-input"
      >
        <div className="logo-preview-box">
          {b.logoDataUrl
            ? <img src={b.logoDataUrl} alt="Business logo" />
            : <span className="logo-placeholder">🏢</span>
          }
        </div>
        <div className="logo-upload-text">
          <strong>{b.logoDataUrl ? 'Logo uploaded ✓' : 'Upload your logo'}</strong>
          <span>PNG, JPG, SVG, or WebP · Max 4 MB</span>
          <input
            id="logo-input"
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={(event) => onLogo(event.target.files?.[0] ?? null)}
            style={{ marginTop: 6, width: 'auto', border: 'none', padding: 0, background: 'none', fontSize: '0.82rem' }}
          />
          {b.logoDataUrl ? (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              style={{ marginTop: 6, alignSelf: 'flex-start' }}
              onClick={(e) => { e.preventDefault(); patch('logoDataUrl', null); }}
            >
              Remove logo
            </button>
          ) : null}
        </div>
      </label>

      <div className="form-grid">
        <Field id="business-name" label="Business name *" error={errors['business.name']}>
          <input
            id="business-name"
            className={inputClass(errors['business.name'])}
            value={b.name}
            onChange={(e) => patch('name', e.target.value)}
            autoComplete="organization"
            placeholder="e.g. SecureTech Solutions"
          />
        </Field>

        <Field id="business-tax" label="Business Reg / Tax ID" optional>
          <input
            id="business-tax"
            value={b.taxId}
            onChange={(e) => patch('taxId', e.target.value)}
            placeholder="e.g. PV00123456 or VAT123"
          />
        </Field>

        <Field id="business-email" label="Email" optional error={errors['business.email']}>
          <input
            id="business-email"
            type="email"
            className={inputClass(errors['business.email'])}
            value={b.email}
            onChange={(e) => patch('email', e.target.value)}
            autoComplete="email"
            placeholder="info@yourbusiness.lk"
          />
        </Field>

        <Field id="business-phone" label="Phone" optional>
          <input
            id="business-phone"
            value={b.phone}
            onChange={(e) => patch('phone', e.target.value)}
            autoComplete="tel"
            placeholder="+94 77 123 4567"
          />
        </Field>

        <Field id="business-address" label="Address" optional className="span-2">
          <input
            id="business-address"
            value={b.address}
            onChange={(e) => patch('address', e.target.value)}
            placeholder="Street address"
          />
        </Field>

        <Field id="business-city" label="City" optional>
          <input
            id="business-city"
            value={b.city}
            onChange={(e) => patch('city', e.target.value)}
            placeholder="e.g. Colombo 03"
          />
        </Field>

        <Field id="business-web" label="Website" optional>
          <input
            id="business-web"
            value={b.website}
            onChange={(e) => patch('website', e.target.value)}
            placeholder="https://yourbusiness.lk"
          />
        </Field>
      </div>
    </section>
  );
}
