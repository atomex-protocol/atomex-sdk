import type { Side } from '../../common/index';
import type { CurrencyDirection } from './currencyDirection';
import type { OrderType } from './orderType';
export interface SymbolLiquidityParametersBase {
    type: OrderType;
}
export declare type SymbolLiquidityParameters = SymbolLiquidityParametersBase & ({
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
