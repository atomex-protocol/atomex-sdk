import type BigNumber from 'bignumber.js';

import type { Currency, Side } from '../../common/index';
import type { OrderType } from '../../exchange/index';

export interface SwapPreview {
  readonly type: OrderType;
  readonly from: SwapPreviewData;
  readonly to: SwapPreviewData;
  readonly symbol: string;
  readonly side: Side;
  readonly fees: {
    success: readonly SwapPreviewFee[];
    refund: readonly SwapPreviewFee[];
  }
  readonly errors: readonly SwapPreviewError[];
  readonly warnings: readonly SwapPreviewWarning[];
}

interface SwapPreviewData {
  readonly address: string;
  readonly currencyId: Currency['id'];
  readonly actual: SwapPreviewCurrencyData;
  readonly available: SwapPreviewCurrencyData;
  readonly max?: SwapPreviewCurrencyData;
}

interface SwapPreviewCurrencyData {
  readonly amount: BigNumber;
  readonly price: BigNumber;
}

interface SwapPreviewError<TErrorData = unknown> {
  readonly id: string
  readonly data: TErrorData;
}

interface SwapPreviewWarning<TWarningData = unknown> {
  readonly id: string
  readonly data: TWarningData;
}

interface SwapPreviewFee {
  readonly name: string;
  readonly currencyId: Currency['id'];
  readonly estimated: BigNumber;
  readonly max: BigNumber;
}
