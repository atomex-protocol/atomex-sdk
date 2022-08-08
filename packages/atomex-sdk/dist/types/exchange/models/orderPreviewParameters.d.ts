import type { BigNumber } from 'bignumber.js';
import type { Side } from '../../common/index';
import type { CurrencyDirection } from './currencyDirection';
import type { OrderType } from './orderType';
interface OrderPreviewParametersBase {
    type: OrderType;
    amount: BigNumber;
    isFromAmount?: boolean;
}
export declare type OrderPreviewParameters = OrderPreviewParametersBase & ({
    from: CurrencyDirection['from'];
    to: CurrencyDirection['to'];
    symbol?: never;
    side?: never;
} | {
    from?: never;
    to?: never;
    symbol: string;
    side: Side;
});
export {};
