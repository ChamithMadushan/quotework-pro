export interface CurrencyOption {
  code: string;
  label: string;
  locale: string;
  symbol: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'LKR', label: 'Sri Lankan Rupee (LKR)', locale: 'en-LK', symbol: 'Rs.' },
  { code: 'USD', label: 'US Dollar (USD)', locale: 'en-US', symbol: '$' },
  { code: 'EUR', label: 'Euro (EUR)', locale: 'en-IE', symbol: '€' },
  { code: 'GBP', label: 'British Pound (GBP)', locale: 'en-GB', symbol: '£' },
  { code: 'INR', label: 'Indian Rupee (INR)', locale: 'en-IN', symbol: '₹' },
  { code: 'AED', label: 'UAE Dirham (AED)', locale: 'en-AE', symbol: 'AED' },
  { code: 'SGD', label: 'Singapore Dollar (SGD)', locale: 'en-SG', symbol: 'S$' },
  { code: 'AUD', label: 'Australian Dollar (AUD)', locale: 'en-AU', symbol: 'A$' },
];

export const DEFAULT_CURRENCY = 'LKR';

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function formatMoney(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.symbol} ${amount.toFixed(2)}`;
  }
}
