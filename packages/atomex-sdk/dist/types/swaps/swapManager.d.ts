import { ImportantDataReceivingMode } from '../common/index';
import type { SwapsSelector } from '../exchange/index';
import type { Swap } from './models/index';
import type { SwapService, SwapServiceEvents } from './swapService';
export declare class SwapManager {
    protected readonly swapService: SwapService;
    readonly events: SwapServiceEvents;
    constructor(swapService: SwapService);
    getSwap(swapId: number, accountAddress: string, mode?: ImportantDataReceivingMode): Promise<Swap>;
    getSwap(swapId: number, accountAddresses: string[], mode?: ImportantDataReceivingMode): Promise<Swap>;
    getSwaps(accountAddress: string, selector?: SwapsSelector, mode?: ImportantDataReceivingMode): Promise<Swap[]>;
    getSwaps(accountAddresses: string[], selector?: SwapsSelector, mode?: ImportantDataReceivingMode): Promise<Swap[]>;
    protected attachEvents(): void;
    protected detachEvents(): void;
    protected handleSwapServiceSwapUpdated: (updatedSwap: Swap) => void;
    dispose(): void;
}
