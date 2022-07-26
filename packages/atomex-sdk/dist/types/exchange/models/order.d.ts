import type { BigNumber } from 'bignumber.js';
import type { Side } from '../../common/index';
import type { OrderStatus } from './orderStatus';
import type { OrderType } from './orderType';
export interface Order {
    readonly id: number;
    readonly clientOrderId: string;
    readonly symbol: string;
    readonly type: OrderType;
    readonly side: Side;
    readonly from: OrderCurrency;
    readonly to: OrderCurrency;
    readonly timeStamp: Date;
    readonly leaveQty: BigNumber;
    readonly status: OrderStatus;
    readonly swapIds: number[];
}
export interface OrderCurrency {
    readonly currencyId: string;
    readonly amount: BigNumber;
    readonly price: BigNumber;
}
