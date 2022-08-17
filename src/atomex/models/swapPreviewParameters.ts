import type BigNumber from 'bignumber.js';

import type { Side } from '../../common/index';
import type { CurrencyDirection, OrderType } from '../../exchange/index';

interface SwapPreviewParametersBase {
  type: OrderType;
  amount: BigNumber;
  useWatchTower?: boolean;
}

export type SwapPreviewParameters = SwapPreviewParametersBase & (
  | {
    from: CurrencyDirection['from'];
    to: CurrencyDirection['to'];
    isFromAmount?: boolean;
    symbol?: never;
    side?: never;
    isQuoteCurrencyAmount?: never;
  }
  | {
    from?: never;
    to?: never;
    isFromAmount?: never;
    symbol: string;
    side: Side;
    isQuoteCurrencyAmount?: boolean;
  });
