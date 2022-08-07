import type { BigNumber } from 'bignumber.js';

import type { Side } from '../../common/index';
import type { OrderStatus } from './orderStatus';
import type { OrderType } from './orderType';
import type { SymbolCurrency } from './symbolCurrency';

export interface Order {
  readonly id: number;
  readonly clientOrderId: string;
  readonly symbol: string;
  readonly type: OrderType
  readonly side: Side;
  readonly from: SymbolCurrency,
  readonly to: SymbolCurrency;
  readonly timeStamp: Date;
  readonly leaveQty: BigNumber;
  readonly status: OrderStatus;
  readonly swapIds: number[]
}
