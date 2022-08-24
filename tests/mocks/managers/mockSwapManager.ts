/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OverloadParameters, OverloadReturnType } from '../../../src/core';
import { SwapManager } from '../../../src/swaps';

export class MockSwapManager extends SwapManager {
  getSwap = jest.fn<OverloadReturnType<SwapManager['getSwap']>, OverloadParameters<SwapManager['getSwap']>>(
    (...args: OverloadParameters<SwapManager['getSwap']>) => (super.getSwap as any)(...args)
  );

  getSwaps = jest.fn<OverloadReturnType<SwapManager['getSwaps']>, OverloadParameters<SwapManager['getSwaps']>>(
    (...args: OverloadParameters<SwapManager['getSwaps']>) => (super.getSwaps as any)(...args)
  );
}
