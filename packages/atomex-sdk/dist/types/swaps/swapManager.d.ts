import { ImportantDataReceivingMode } from '../common/index';
import type { SwapsSelector } from '../exchange/index';
import type { Swap } from './models/index';
import type { SwapService, SwapServiceEvents } from './swapService';
export declare class SwapManager {
    protected readonly swapService: SwapService;
    readonly events: SwapServiceEvents;
    constructor(swapService: SwapService);
    getSwap(accountAddress: string, swapId: number, _mode?: ImportantDataReceivingMode): Promise<Swap>;
    getSwaps(accountAddress: string, selector?: SwapsSelector, _mode?: ImportantDataReceivingMode): Promise<Swap[]>;
    protected attachEvents(): void;
    protected detachEvents(): void;
    protected handleSwapServiceSwapUpdated: (updatedOrder: Swap) => void;
}
