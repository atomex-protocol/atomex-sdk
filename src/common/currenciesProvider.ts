import type { Currency } from './models';

export interface CurrenciesProvider {
  getCurrency(currencyId: Currency['id']): Promise<Currency | undefined>;
}
