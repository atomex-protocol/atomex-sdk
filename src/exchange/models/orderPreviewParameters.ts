import type { BigNumber } from 'bignumber.js';

import type { Side } from '../../common/index';
import type { CurrencyDirection } from './currencyDirection';
import type { OrderType } from './orderType';

interface OrderPreviewParametersBase {
  readonly type: OrderType;
  readonly amount: BigNumber;
  readonly isFromAmount?: boolean;
}

export type OrderPreviewParameters = OrderPreviewParametersBase & (
  | {
    from: CurrencyDirection['from'];
    to: CurrencyDirection['to'];
    symbol?: never;
    side?: never;
  }
  | {
    from?: never;
    to?: never;
    symbol: string;
    side: Side;
  });
