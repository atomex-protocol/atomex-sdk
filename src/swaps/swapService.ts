import type { PublicEventEmitter } from '../core/eventEmitter';
import type { SwapsSelector } from '../exchange/index';
import type { Swap } from './models/swap';

export interface SwapServiceEvents {
  readonly swapUpdated: PublicEventEmitter<readonly [updatedOrder: Swap]>;
}

export interface SwapService {
  readonly events: SwapServiceEvents;

  getSwap(accountAddresses: string[], swapId: number): Promise<Swap>;
  getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
}
