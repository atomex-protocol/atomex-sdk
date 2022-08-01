import type { AuthorizationManager } from '../authorization/index';
import type { Signer, SignersManager } from '../blockchain/index';
import type { ExchangeManager } from '../exchange/exchangeManager';
import type { Swap, SwapManager } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import type { SwapOperationCompleteStage, AtomexBlockchainOptions, AtomexOptions, NewSwapRequest } from './models/index';
export declare class Atomex {
    readonly options: AtomexOptions;
    readonly authorization: AuthorizationManager;
    readonly exchangeManager: ExchangeManager;
    readonly swapManager: SwapManager;
    readonly signers: SignersManager;
    protected readonly atomexContext: AtomexContext;
    constructor(options: AtomexOptions);
    get atomexNetwork(): import("../index").AtomexNetwork;
    addSigner(signer: Signer): Promise<void>;
    addBlockchain(_factoryMethod: (context: AtomexContext) => AtomexBlockchainOptions): void;
    swap(newSwapRequest: NewSwapRequest, completeStage: SwapOperationCompleteStage): Promise<Swap>;
    swap(swapId: Swap['id'], completeStage: SwapOperationCompleteStage): Promise<Swap>;
}
