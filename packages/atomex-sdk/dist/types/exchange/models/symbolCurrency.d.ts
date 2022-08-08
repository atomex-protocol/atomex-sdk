import type { BigNumber } from 'bignumber.js';
export interface SymbolCurrency {
    readonly currencyId: string;
    readonly amount: BigNumber;
    readonly price: BigNumber;
}
