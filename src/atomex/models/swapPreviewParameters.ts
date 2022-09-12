import type BigNumber from 'bignumber.js';

import type { Side } from '../../common/index';
import type { CurrencyDirection, ExchangeSymbol, OrderType } from '../../exchange/index';

interface WatchTowerOptions {
  redeemEnabled?: boolean;
  refundEnabled?: boolean;
}

interface SwapPreviewParametersBase {
  type: OrderType;
  amount: BigNumber;
  watchTower?: WatchTowerOptions;
}

export type SwapPreviewParameters = SwapPreviewParametersBase & (
  | {
    from: CurrencyDirection['from'];
    to: CurrencyDirection['to'];
    isFromAmount?: boolean;
    symbol?: never;
    side?: never;
    isBaseCurrencyAmount?: never;
  }
  | {
    from?: never;
    to?: never;
    isFromAmount?: never;
    symbol: string;
    side: Side;
    isBaseCurrencyAmount?: boolean;
  });

interface NormalizedWatchTowerOptions {
  redeemEnabled: boolean;
  refundEnabled: boolean;
}

export interface NormalizedSwapPreviewParameters {
  readonly type: OrderType;
  readonly amount: BigNumber;
  readonly watchTower: NormalizedWatchTowerOptions;
  readonly from: CurrencyDirection['from'];
  readonly to: CurrencyDirection['to'];
  readonly isFromAmount: boolean;
  readonly exchangeSymbol: ExchangeSymbol;
  readonly side: Side
  readonly isBaseCurrencyAmount: boolean;
}
