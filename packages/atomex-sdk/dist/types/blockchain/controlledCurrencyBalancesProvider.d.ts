import type { BigNumber } from 'bignumber.js';
import type { Currency } from '../common/index';
import type { CurrencyBalanceProvider } from './currencyBalanceProvider';
export declare class ControlledCurrencyBalancesProvider implements CurrencyBalanceProvider {
    readonly currency: Currency;
    protected readonly getBalanceImplementation: (address: string) => Promise<BigNumber>;
    constructor(currency: Currency, getBalanceImplementation: (address: string) => Promise<BigNumber>);
    getBalance(address: string): Promise<BigNumber>;
}
