import type { PublicEventEmitter } from '../core/eventEmitter';
import type { SwapsSelector } from '../exchange/index';
import type { Swap } from './models/swap';
export interface SwapServiceEvents {
    readonly swapUpdated: PublicEventEmitter<readonly [updatedSwap: Swap]>;
}
export interface SwapService {
    readonly events: SwapServiceEvents;
    getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
    getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
    getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
    getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
    dispose(): void;
}
