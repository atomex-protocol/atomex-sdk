import { AtomexService, ImportantDataReceivingMode } from '../common/index';
import type { SwapsSelector } from '../exchange/index';
import type { Swap } from './models/index';
import type { SwapService, SwapServiceEvents } from './swapService';
export declare class SwapManager implements AtomexService {
    protected readonly swapService: SwapService;
    readonly events: SwapServiceEvents;
    private _isStarted;
    constructor(swapService: SwapService);
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    getSwap(swapId: number, accountAddress: string, mode?: ImportantDataReceivingMode): Promise<Swap | undefined>;
    getSwap(swapId: number, accountAddresses: string[], mode?: ImportantDataReceivingMode): Promise<Swap | undefined>;
    getSwaps(accountAddress: string, selector?: SwapsSelector, mode?: ImportantDataReceivingMode): Promise<Swap[]>;
    getSwaps(accountAddresses: string[], selector?: SwapsSelector, mode?: ImportantDataReceivingMode): Promise<Swap[]>;
    protected attachEvents(): void;
    protected detachEvents(): void;
    protected handleSwapServiceSwapUpdated: (updatedSwap: Swap) => void;
}
