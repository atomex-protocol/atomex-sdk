import type { AuthorizationManager } from '../authorization/index';
import type { WalletsManager, AtomexBlockchainProvider } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { ExchangeManager, ExchangeService, ManagedExchangeSymbolsProvider, ManagedOrderBookProvider } from '../exchange/index';
import type { SwapManager, SwapService } from '../swaps/index';
export declare class AtomexContext {
    readonly atomexNetwork: AtomexNetwork;
    private static idCounter;
    readonly id: number;
    readonly managers: AtomexContextManagersSection;
    readonly services: AtomexContextServicesSection;
    readonly providers: AtomexContextProvidersSection;
    constructor(atomexNetwork: AtomexNetwork);
}
declare class AtomexContextManagersSection {
    readonly context: AtomexContext;
    private _walletsManager;
    private _authorizationManager;
    private _exchangeManager;
    private _swapManager;
    constructor(context: AtomexContext);
    get walletsManager(): WalletsManager;
    private set walletsManager(value);
    get authorizationManager(): AuthorizationManager;
    private set authorizationManager(value);
    get exchangeManager(): ExchangeManager;
    private set exchangeManager(value);
    get swapManager(): SwapManager;
    private set swapManager(value);
}
declare class AtomexContextServicesSection {
    readonly context: AtomexContext;
    private _exchangeService;
    private _swapService;
    constructor(context: AtomexContext);
    get exchangeService(): ExchangeService;
    private set exchangeService(value);
    get swapService(): SwapService;
    private set swapService(value);
}
declare class AtomexContextProvidersSection {
    readonly context: AtomexContext;
    private _blockchainProvider;
    private _currenciesProvider;
    private _exchangeSymbolsProvider;
    private _orderBookProvider;
    constructor(context: AtomexContext);
    get blockchainProvider(): AtomexBlockchainProvider;
    private set blockchainProvider(value);
    get currenciesProvider(): CurrenciesProvider;
    private set currenciesProvider(value);
    get exchangeSymbolsProvider(): ManagedExchangeSymbolsProvider;
    private set exchangeSymbolsProvider(value);
    get orderBookProvider(): ManagedOrderBookProvider;
    private set orderBookProvider(value);
}
export declare class AtomexComponentNotResolvedError extends Error {
    readonly name: string;
    readonly componentName: string;
    constructor(componentName: string);
    private static getMessage;
}
export {};
