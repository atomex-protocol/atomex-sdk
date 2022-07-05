import type { Currency } from './models/index';

export interface CurrenciesProvider {
  getCurrency(currencyId: Currency['id']): Promise<Currency | undefined>;
}
