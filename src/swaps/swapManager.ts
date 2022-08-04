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

  getSwap(swapId: number, accountAddress: string, mode?: ImportantDataReceivingMode): Promise<Swap>;
  getSwap(swapId: number, accountAddresses: string[], mode?: ImportantDataReceivingMode): Promise<Swap>;
  getSwap(swapId: number, addressOrAddresses: string | string[], _mode = ImportantDataReceivingMode.SafeMerged): Promise<Swap> {
    return (this.swapService.getSwap as (swapId: number, addressOrAddresses: string | string[]) => Promise<Swap>)(swapId, addressOrAddresses);
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector, mode?: ImportantDataReceivingMode): Promise<Swap[]>;
  getSwaps(accountAddresses: string[], selector?: SwapsSelector, mode?: ImportantDataReceivingMode): Promise<Swap[]>;
  getSwaps(addressOrAddresses: string | string[], selector?: SwapsSelector, _mode = ImportantDataReceivingMode.SafeMerged): Promise<Swap[]> {
    return (this.swapService.getSwaps as (addressOrAddresses: string | string[], selector?: SwapsSelector) => Promise<Swap[]>)(addressOrAddresses, selector);
  }

  protected attachEvents() {
    this.swapService.events.swapUpdated.addListener(this.handleSwapServiceSwapUpdated);
  }

  protected detachEvents() {
    this.swapService.events.swapUpdated.removeListener(this.handleSwapServiceSwapUpdated);
  }

  protected handleSwapServiceSwapUpdated = (updatedSwap: Swap) => {
    (this.events.swapUpdated as ToEventEmitter<typeof this.events.swapUpdated>).emit(updatedSwap);
  };

  dispose() {
    this.swapService.dispose();
  }
}
