import type BigNumber from 'bignumber.js';
import type { Currency } from '../../common/index';
interface ExchangeSymbolDecimals {
    readonly quoteCurrency: number;
    readonly baseCurrency: number;
    readonly price: number;
}
export interface ExchangeSymbol {
    readonly name: string;
    readonly quoteCurrency: Currency['id'];
    readonly baseCurrency: Currency['id'];
    readonly minimumQty: BigNumber;
    readonly decimals: ExchangeSymbolDecimals;
}
export {};
