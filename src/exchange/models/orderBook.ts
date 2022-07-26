import type { BigNumber } from 'bignumber.js';

import { Currency, Side } from '../../common/index';

export interface OrderBook {
  readonly updateId: number;
  readonly symbol: string;
  readonly baseCurrency: Currency['id'];
  readonly quoteCurrency: Currency['id'];
  readonly entries: readonly OrderBookEntry[];
}

export interface OrderBookEntry {
  readonly side: Side;
  readonly price: BigNumber;
  readonly qtyProfile: readonly number[];
}
