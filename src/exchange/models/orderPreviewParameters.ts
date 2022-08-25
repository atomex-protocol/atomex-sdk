import type { BigNumber } from 'bignumber.js';

import type { Side } from '../../common/index';
import type { CurrencyDirection } from './currencyDirection';
import type { ExchangeSymbol } from './exchangeSymbol';
import type { OrderType } from './orderType';

interface OrderPreviewParametersBase {
  type: OrderType;
  amount: BigNumber;
}

export type OrderPreviewParameters = OrderPreviewParametersBase & (
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

export type NormalizedOrderPreviewParameters = Readonly<OrderPreviewParametersBase> & {
  readonly exchangeSymbol: ExchangeSymbol;
  readonly side: Side;
  readonly isBaseCurrencyAmount: boolean;
  readonly from: CurrencyDirection['from'];
  readonly to: CurrencyDirection['to'];
  readonly isFromAmount: boolean;
};
