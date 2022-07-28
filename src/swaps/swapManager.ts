import { ImportantDataReceivingMode } from '../common/index';
import { EventEmitter, ToEventEmitter } from '../core/index';
import type { SwapsSelector } from '../exchange/index';
import type { Swap } from './models/index';
import type { SwapService, SwapServiceEvents } from './swapService';

export class SwapManager {
  readonly events: SwapServiceEvents = {
    swapUpdated: new EventEmitter()
  };

  constructor(
    protected readonly swapService: SwapService
  ) {
    this.attachEvents();
  }

  getSwap(accountAddress: string, swapId: number, _mode = ImportantDataReceivingMode.SafeMerged): Promise<Swap> {
    return this.swapService.getSwap(accountAddress, swapId);
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector, _mode = ImportantDataReceivingMode.SafeMerged): Promise<Swap[]> {
    return this.swapService.getSwaps(accountAddress, selector);
  }

  protected attachEvents() {
    this.swapService.events.swapUpdated.addListener(this.handleSwapServiceSwapUpdated);
  }

  protected detachEvents() {
    this.swapService.events.swapUpdated.removeListener(this.handleSwapServiceSwapUpdated);
  }

  protected handleSwapServiceSwapUpdated = (updatedOrder: Swap) => {
    (this.events.swapUpdated as ToEventEmitter<typeof this.events.swapUpdated>).emit(updatedOrder);
  };
}
