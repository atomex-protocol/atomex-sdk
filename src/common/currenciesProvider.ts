import type { Currency } from './models/index';

export interface CurrenciesProvider {
  getCurrency(currencyId: Currency['id']): Currency | undefined;
}
