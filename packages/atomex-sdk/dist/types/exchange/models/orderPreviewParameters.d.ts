import type { BigNumber } from 'bignumber.js';
import type { Side } from '../../common/index';
import type { CurrencyDirection } from './currencyDirection';
import type { ExchangeSymbol } from './exchangeSymbol';
import type { OrderType } from './orderType';
interface OrderPreviewParametersBase {
    type: OrderType;
    amount: BigNumber;
}
export declare type OrderPreviewParameters = OrderPreviewParametersBase & ({
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
export declare type PreparedPreviewParameters = Readonly<OrderPreviewParametersBase> & {
    readonly exchangeSymbol: ExchangeSymbol;
    readonly side: Side;
    readonly isQuoteCurrencyAmount: boolean;
};
export {};
