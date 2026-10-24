import { useQuotation } from '../../context/QuotationContext';
import { Field, inputClass } from '../Field';

export function CustomerForm() {
  const { quotation, updateQuotation, errors } = useQuotation();
  const c = quotation.customer;

  function patch<K extends keyof typeof c>(key: K, value: (typeof c)[K]) {
    updateQuotation((current) => ({
      ...current,
      customer: { ...current.customer, [key]: value },
    }));
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Customer</h2>
          <p className="panel-subtitle">Who is this quotation prepared for?</p>
        </div>
      </div>

      <div className="form-grid">
        <Field id="customer-name" label="Contact name *" error={errors['customer.name']}>
          <input
            id="customer-name"
            className={inputClass(errors['customer.name'])}
            value={c.name}
            onChange={(e) => patch('name', e.target.value)}
            autoComplete="name"
            placeholder="e.g. Kasun Perera"
          />
        </Field>

        <Field id="customer-company" label="Company" optional>
          <input
            id="customer-company"
            value={c.company}
            onChange={(e) => patch('company', e.target.value)}
            autoComplete="organization"
            placeholder="e.g. ABC Enterprises Ltd"
          />
        </Field>

        <Field id="customer-email" label="Email" optional error={errors['customer.email']}>
          <input
            id="customer-email"
            type="email"
            className={inputClass(errors['customer.email'])}
            value={c.email}
            onChange={(e) => patch('email', e.target.value)}
            autoComplete="email"
            placeholder="customer@example.lk"
          />
        </Field>

        <Field id="customer-phone" label="Phone" optional>
          <input
            id="customer-phone"
            value={c.phone}
            onChange={(e) => patch('phone', e.target.value)}
            autoComplete="tel"
            placeholder="+94 71 234 5678"
          />
        </Field>

        <Field id="customer-address" label="Address" optional className="span-2">
          <input
            id="customer-address"
            value={c.address}
            onChange={(e) => patch('address', e.target.value)}
            placeholder="Street address"
          />
        </Field>

        <Field id="customer-city" label="City" optional>
          <input
            id="customer-city"
            value={c.city}
            onChange={(e) => patch('city', e.target.value)}
            placeholder="e.g. Kandy"
          />
        </Field>
      </div>
    </section>
  );
}
