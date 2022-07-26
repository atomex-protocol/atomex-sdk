import { ImportantDataReceivingMode, Swap, SwapsSelector } from '../index';
import { SwapService } from './swapService';
export declare class SwapManager {
    protected readonly swapService: SwapService;
    constructor(swapService: SwapService);
    getSwap(accountAddress: string, swapId: number, _mode?: ImportantDataReceivingMode): Promise<Swap>;
    getSwaps(accountAddress: string, selector?: SwapsSelector, _mode?: ImportantDataReceivingMode): Promise<Swap[]>;
}
