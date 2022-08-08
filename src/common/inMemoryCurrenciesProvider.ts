import { guards } from '../utils';
import type { CurrenciesProvider } from './currenciesProvider';
import type { Currency } from './models/index';

export class InMemoryCurrenciesProvider implements CurrenciesProvider {
  protected readonly currencies: Map<Currency['id'], Currency>;

  constructor(currencies: ReadonlyMap<Currency['id'], Currency>);
  constructor(currencies: readonly Currency[]);
  constructor(currencies: { readonly [currencyId: Currency['id']]: Currency });
  constructor(currencies:
    | readonly Currency[]
    | ReadonlyMap<Currency['id'], Currency>
    | { readonly [currencyId: Currency['id']]: Currency }
  ) {
    this.currencies = guards.isReadonlyArray(currencies)
      ? InMemoryCurrenciesProvider.mapCurrenciesArrayToMap(currencies)
      : new Map(currencies instanceof Map ? currencies : Object.entries(currencies));
  }

  getCurrency(currencyId: Currency['id']): Currency | undefined {
    return this.currencies.get(currencyId);
  }

  addCurrency(currency: Currency) {
    this.currencies.set(currency.id, currency);
  }

  removeCurrency(currencyId: Currency['id']) {
    return this.currencies.delete(currencyId);
  }

  private static mapCurrenciesArrayToMap(currenciesArray: readonly Currency[]): Map<Currency['id'], Currency> {
    const currenciesMap: Map<Currency['id'], Currency> = new Map();

    for (const currency of currenciesArray)
      currenciesMap.set(currency.id, currency);

    return currenciesMap;
  }
}
