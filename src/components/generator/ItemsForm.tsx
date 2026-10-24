import { useQuotation } from '../../context/QuotationContext';
import { formatMoney } from '../../lib/currency';
import type { DiscountType, LineItem } from '../../types/quotation';

export function ItemsForm() {
  const { quotation, totals, errors, addItem, removeItem, updateQuotation } = useQuotation();

  function patchItem(id: string, patch: Partial<LineItem>) {
    updateQuotation((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Line items</h2>
          <p className="panel-subtitle">Add the products or services you are quoting.</p>
        </div>
        <button type="button" className="btn btn-accent btn-sm" onClick={addItem}>
          + Add item
        </button>
      </div>

      {errors.items ? (
        <div className="banner banner-error" role="alert" style={{ marginBottom: 14 }}>
          <span className="banner-icon">⚠️</span>
          {errors.items}
        </div>
      ) : null}

      <div className="items-wrap">
        <table className="items-table">
          <thead>
            <tr>
              <th className="item-desc-td">Description</th>
              <th className="item-qty-td">Qty</th>
              <th className="item-price-td">Unit price</th>
              <th className="item-disc-td">Discount</th>
              <th className="item-total-td">Line total</th>
              <th className="item-action-td"><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, index) => {
              const line = totals.lines.find((entry) => entry.id === item.id);
              const hasError = !!(
                errors[`items.${index}.description`] ||
                errors[`items.${index}.quantity`] ||
                errors[`items.${index}.unitPrice`] ||
                errors[`items.${index}.discountValue`]
              );

              return (
                <tr key={item.id} style={hasError ? { background: 'var(--danger-bg)' } : undefined}>
                  <td className="item-desc-td">
                    <input
                      aria-label={`Item ${index + 1} description`}
                      className={errors[`items.${index}.description`] ? 'invalid' : ''}
                      value={item.description}
                      onChange={(e) => patchItem(item.id, { description: e.target.value })}
                      placeholder={`Item ${index + 1}`}
                    />
                  </td>
                  <td className="item-qty-td">
                    <input
                      aria-label={`Item ${index + 1} quantity`}
                      type="number"
                      min={0}
                      step="any"
                      className={errors[`items.${index}.quantity`] ? 'invalid' : ''}
                      value={item.quantity}
                      onChange={(e) => patchItem(item.id, { quantity: Number(e.target.value) })}
                    />
                  </td>
                  <td className="item-price-td">
                    <input
                      aria-label={`Item ${index + 1} unit price`}
                      type="number"
                      min={0}
                      step="0.01"
                      className={errors[`items.${index}.unitPrice`] ? 'invalid' : ''}
                      value={item.unitPrice}
                      onChange={(e) => patchItem(item.id, { unitPrice: Number(e.target.value) })}
                    />
                  </td>
                  <td className="item-disc-td">
                    <div className="disc-inputs">
                      <select
                        aria-label={`Item ${index + 1} discount type`}
                        value={item.discountType}
                        onChange={(e) =>
                          patchItem(item.id, {
                            discountType: e.target.value as DiscountType,
                            discountValue: e.target.value === 'none' ? 0 : item.discountValue,
                          })
                        }
                      >
                        <option value="none">None</option>
                        <option value="percent">%</option>
                        <option value="amount">Amt</option>
                      </select>
                      {item.discountType !== 'none' ? (
                        <input
                          aria-label={`Item ${index + 1} discount value`}
                          type="number"
                          min={0}
                          step="0.01"
                          className={errors[`items.${index}.discountValue`] ? 'invalid' : ''}
                          value={item.discountValue}
                          onChange={(e) => patchItem(item.id, { discountValue: Number(e.target.value) })}
                          placeholder={item.discountType === 'percent' ? '0–100' : '0.00'}
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="item-total-td">
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>
                      {formatMoney(line?.net ?? 0, quotation.currency)}
                    </span>
                    {(line?.discount ?? 0) > 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--ok)', marginTop: 2 }}>
                        −{formatMoney(line!.discount, quotation.currency)}
                      </div>
                    ) : null}
                  </td>
                  <td className="item-action-td">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeItem(item.id)}
                      disabled={quotation.items.length === 1}
                      title="Remove item"
                      aria-label={`Remove item ${index + 1}`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="add-item-row">
        <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}>
          + Add another item
        </button>
      </div>

      {/* Subtotal row */}
      {quotation.items.some((i) => i.description.trim()) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 2 }}>Items subtotal</div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>
              {formatMoney(totals.subtotal, quotation.currency)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
