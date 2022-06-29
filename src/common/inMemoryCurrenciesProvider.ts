import type { CurrenciesProvider } from './currenciesProvider';
import type { Currency } from './models/index';

export class InMemoryCurrenciesProvider implements CurrenciesProvider {
  protected readonly currencies: Map<Currency['id'], Currency>;

  constructor(currencies: { readonly [currencyId: Currency['id']]: Currency });
  constructor(currencies: ReadonlyMap<Currency['id'], Currency>);
  constructor(currencies: { readonly [currencyId: Currency['id']]: Currency } | ReadonlyMap<Currency['id'], Currency>) {
    this.currencies = new Map(currencies instanceof Map ? currencies : Object.entries(currencies));
  }

  getCurrency(currencyId: Currency['id']): Promise<Currency | undefined> {
    return Promise.resolve(this.currencies.get(currencyId));
  }

  addCurrency(currency: Currency) {
    this.currencies.set(currency.id, currency);
  }

  removeCurrency(currencyId: Currency['id']) {
    return this.currencies.delete(currencyId);
  }
}
