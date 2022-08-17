import type { AuthorizationManager } from '../authorization/index';
import type { WalletsManager } from '../blockchain/index';
import type { AtomexService, Currency } from '../common/index';
import type { ExchangeManager } from '../exchange/exchangeManager';
import type { Swap, SwapManager } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import { SwapOperationCompleteStage, AtomexOptions, NewSwapRequest, AtomexBlockchainNetworkOptions } from './models/index';
export declare class Atomex implements AtomexService {
    readonly options: AtomexOptions;
    readonly authorization: AuthorizationManager;
    readonly exchangeManager: ExchangeManager;
    readonly swapManager: SwapManager;
    readonly wallets: WalletsManager;
    readonly atomexContext: AtomexContext;
    private _isStarted;
    constructor(options: AtomexOptions);
    get atomexNetwork(): import("../common/index").AtomexNetwork;
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    addBlockchain(factoryMethod: (context: AtomexContext) => [blockchain: string, options: AtomexBlockchainNetworkOptions]): void;
    getCurrency(currencyId: Currency['id']): Currency | undefined;
    swap(newSwapRequest: NewSwapRequest, completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
    swap(swapId: Swap['id'], completeStage?: SwapOperationCompleteStage): Promise<Swap | readonly Swap[]>;
}
