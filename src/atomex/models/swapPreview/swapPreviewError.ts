import type BigNumber from 'bignumber.js';

import type { Currency } from '../../../common/index';
import type { Swap } from '../../../swaps';

interface SwapPreviewErrorBase<TErrorId extends string = string, TErrorData = unknown> {
  readonly id: TErrorId;
  readonly data?: TErrorData;
}

type CheckErrorType<TErrorId extends string, TError extends SwapPreviewErrorBase<TErrorId>> = TError;

type NotEnoughFundsSwapPreviewError = CheckErrorType<
  'not-enough-funds',
  | {
    readonly id: 'not-enough-funds';
    readonly data: {
      readonly type: 'balance';
      readonly currencyId: Currency['id'];
      readonly requiredAmount: BigNumber;
    };
  }
  | {
    readonly id: 'not-enough-funds';
    readonly data: {
      readonly type: 'fees';
      readonly currencyId: Currency['id'];
      readonly requiredAmount: BigNumber;
    };
  }
  | {
    readonly id: 'not-enough-funds';
    readonly data: {
      readonly type: 'swaps';
      readonly swapIds: ReadonlyArray<Swap['id']>;
      readonly currencyId: Currency['id'];
      readonly lockedAmount: BigNumber;
    };
  }
>;

export type SwapPreviewError = CheckErrorType<
  string,
  | NotEnoughFundsSwapPreviewError
  | {
    readonly id: 'not-enough-liquidity'
  }
>;
