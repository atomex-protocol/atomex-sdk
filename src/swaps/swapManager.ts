import { ImportantDataReceivingMode, Swap, SwapsSelector } from '../index';
import { SwapService } from './SwapService';

export class SwapManager {
  constructor(
    protected readonly swapService: SwapService
  ) {
  }

  getSwap(accountAddress: string, swapId: number, _mode = ImportantDataReceivingMode.SafeMerged): Promise<Swap> {
    return this.swapService.getSwap(accountAddress, swapId);
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector, _mode = ImportantDataReceivingMode.SafeMerged): Promise<Swap[]> {
    return this.swapService.getSwaps(accountAddress, selector);
  }
}
