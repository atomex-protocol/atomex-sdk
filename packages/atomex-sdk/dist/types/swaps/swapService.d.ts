import type { AtomexService } from '../common/atomexService';
import type { PublicEventEmitter } from '../core/index';
import type { SwapsSelector } from '../exchange/index';
import type { Swap } from './models/swap';
export interface SwapServiceEvents {
    readonly swapUpdated: PublicEventEmitter<readonly [updatedSwap: Swap]>;
}
export interface SwapService extends AtomexService {
    readonly events: SwapServiceEvents;
    getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
    getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
    getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
    getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
}
