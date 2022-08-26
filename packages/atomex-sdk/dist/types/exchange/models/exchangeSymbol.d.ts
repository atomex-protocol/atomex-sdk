import type BigNumber from 'bignumber.js';
import type { Currency } from '../../common/index';
interface ExchangeSymbolDecimals {
    readonly baseCurrency: number;
    readonly quoteCurrency: number;
    readonly price: number;
}
export interface ExchangeSymbol {
    readonly name: string;
    readonly baseCurrency: Currency['id'];
    readonly quoteCurrency: Currency['id'];
    readonly minimumQty: BigNumber;
    readonly decimals: ExchangeSymbolDecimals;
}
export {};
