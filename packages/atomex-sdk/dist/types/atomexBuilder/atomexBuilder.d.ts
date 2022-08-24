import { Atomex, AtomexContext } from '../atomex/index';
import type { AtomexBlockchainNetworkOptions } from '../atomex/models/index';
import type { AuthorizationManager } from '../authorization/index';
import { WalletsManager } from '../blockchain/index';
import type { DeepReadonly } from '../core/index';
import { ExchangeManager, InMemoryExchangeSymbolsProvider, InMemoryOrderBookProvider, PriceManager } from '../exchange/index';
import { SwapManager } from '../swaps/swapManager';
import type { AtomexBuilderOptions } from './atomexBuilderOptions';
import { AuthorizationManagerDefaultComponentOptions } from './atomexComponents/index';
import type { CustomAtomexComponentFactory } from './customAtomexComponentFactory';
export declare class AtomexBuilder {
    protected readonly options: DeepReadonly<AtomexBuilderOptions>;
    protected readonly atomexContext: AtomexContext;
    protected customAuthorizationManagerFactory?: CustomAtomexComponentFactory<AuthorizationManager, AuthorizationManagerDefaultComponentOptions>;
    protected customWalletsManagerFactory?: CustomAtomexComponentFactory<WalletsManager>;
    protected customExchangeManagerFactory?: CustomAtomexComponentFactory<ExchangeManager>;
    private get controlledAtomexContext();
    constructor(options: DeepReadonly<AtomexBuilderOptions>, atomexContext?: AtomexContext);
    useAuthorizationManager(customAuthorizationManagerFactory: NonNullable<AtomexBuilder['customAuthorizationManagerFactory']>): AtomexBuilder;
    useWalletsManager(customWalletsManagerFactory: NonNullable<AtomexBuilder['customWalletsManagerFactory']>): AtomexBuilder;
    useExchangeManager(customExchangeManagerFactory: NonNullable<AtomexBuilder['customExchangeManagerFactory']>): AtomexBuilder;
    build(): Atomex;
    protected createExchangeSymbolsProvider(): InMemoryExchangeSymbolsProvider;
    protected createOrderBookProvider(): InMemoryOrderBookProvider;
    protected createAuthorizationManager(): AuthorizationManager;
    protected createWalletsManager(): WalletsManager;
    protected createDefaultExchangeService(): import("..").MixedApiAtomexClient;
    protected createExchangeManager(): ExchangeManager;
    protected createSwapManager(): SwapManager;
    protected createDefaultBlockchainOptions(): Record<string, AtomexBlockchainNetworkOptions>;
    protected createPriceManager(): PriceManager;
}
