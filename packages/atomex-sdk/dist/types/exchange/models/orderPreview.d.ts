import type { Side } from '../../common/index';
import type { OrderType } from './orderType';
import type { SymbolCurrency } from './symbolCurrency';
export interface OrderPreview {
    readonly type: OrderType;
    readonly from: SymbolCurrency;
    readonly to: SymbolCurrency;
    readonly symbol: string;
    readonly side: Side;
}
