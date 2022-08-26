import type BigNumber from 'bignumber.js';
import type { Side } from '../../common/index';
import type { CurrencyDirection, ExchangeSymbol, OrderType } from '../../exchange/index';
interface SwapPreviewParametersBase {
    type: OrderType;
    amount: BigNumber;
    useWatchTower?: boolean;
}
export declare type SwapPreviewParameters = SwapPreviewParametersBase & ({
    from: CurrencyDirection['from'];
    to: CurrencyDirection['to'];
    isFromAmount?: boolean;
    symbol?: never;
    side?: never;
    isQuoteCurrencyAmount?: never;
} | {
    from?: never;
    to?: never;
    isFromAmount?: never;
    symbol: string;
    side: Side;
    isQuoteCurrencyAmount?: boolean;
});
export interface NormalizedSwapPreviewParameters {
    readonly type: OrderType;
    readonly amount: BigNumber;
    readonly useWatchTower: boolean;
    readonly from: CurrencyDirection['from'];
    readonly to: CurrencyDirection['to'];
    readonly isFromAmount: boolean;
    readonly exchangeSymbol: ExchangeSymbol;
    readonly side: Side;
    readonly isQuoteCurrencyAmount: boolean;
}
export {};
