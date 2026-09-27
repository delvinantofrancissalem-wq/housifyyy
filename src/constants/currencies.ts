import { CurrencyCode, CurrencyConfig } from '../types/civil';

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar (USD)',
    rateMultiplierToUSD: 1.0,
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (EUR)',
    rateMultiplierToUSD: 0.92,
    locale: 'de-DE',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (GBP)',
    rateMultiplierToUSD: 0.79,
    locale: 'en-GB',
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee (INR)',
    rateMultiplierToUSD: 84.5,
    locale: 'en-IN',
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar (CAD)',
    rateMultiplierToUSD: 1.37,
    locale: 'en-CA',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar (AUD)',
    rateMultiplierToUSD: 1.53,
    locale: 'en-AU',
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham (AED)',
    rateMultiplierToUSD: 3.67,
    locale: 'en-AE',
  },
};

export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  
  if (currencyCode === 'INR') {
    // Format Indian numbering format (lakhs & crores)
    return `${config.symbol}${Math.round(amount).toLocaleString('en-IN')}`;
  }

  return `${config.symbol}${Math.round(amount).toLocaleString(config.locale)}`;
}
