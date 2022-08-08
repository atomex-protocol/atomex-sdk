import type { CurrenciesProvider } from './currenciesProvider';
import type { Currency } from './models/index';
export declare class InMemoryCurrenciesProvider implements CurrenciesProvider {
    protected readonly currencies: Map<Currency['id'], Currency>;
    constructor(currencies: ReadonlyMap<Currency['id'], Currency>);
    constructor(currencies: readonly Currency[]);
    constructor(currencies: {
        readonly [currencyId: Currency['id']]: Currency;
    });
    getCurrency(currencyId: Currency['id']): Currency | undefined;
    addCurrency(currency: Currency): void;
    removeCurrency(currencyId: Currency['id']): boolean;
    private static mapCurrenciesArrayToMap;
}
