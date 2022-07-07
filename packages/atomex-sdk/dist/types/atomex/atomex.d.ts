import type { SignersManager } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { Swap } from '../swaps/index';
import { SwapOperationCompleteStage, type AtomexOptions, type NewSwapRequest } from './models/index';
export declare class Atomex {
    readonly atomexNetwork: AtomexNetwork;
    readonly authorization: import("../index").AuthorizationManager;
    readonly signers: SignersManager;
    readonly currenciesProvider: CurrenciesProvider;
    constructor(options: AtomexOptions);
    swap(newSwapRequest: NewSwapRequest, completeStage: SwapOperationCompleteStage): Promise<Swap>;
    swap(swapId: Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap>;
}
