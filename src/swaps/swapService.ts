import { PublicEventEmitter } from '../core/eventEmitter';
import { Swap, SwapsSelector } from '../index';

export interface SwapServiceEvents {
  readonly swapUpdated: PublicEventEmitter<readonly [updatedOrder: Swap]>;
}

export interface SwapService {
  readonly events: SwapServiceEvents;

  getSwap(accountAddress: string, swapId: number): Promise<Swap>;
  getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
}
