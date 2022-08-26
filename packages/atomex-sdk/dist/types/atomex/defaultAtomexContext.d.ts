import type { AuthorizationManager } from '../authorization/index';
import type { BalanceManager } from '../blockchain/balanceManager';
import type { WalletsManager, AtomexBlockchainProvider } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { ExchangeManager, ExchangeService, ManagedExchangeSymbolsProvider, ManagedOrderBookProvider, PriceManager } from '../exchange/index';
import type { SwapManager, SwapService } from '../swaps/index';
import { AtomexContext, AtomexContextManagersSection, AtomexContextProvidersSection, AtomexContextServicesSection } from './atomexContext';
export declare class DefaultAtomexContext implements AtomexContext {
    readonly atomexNetwork: AtomexNetwork;
    private static idCounter;
    readonly id: number;
    readonly managers: DefaultAtomexContextManagersSection;
    readonly services: DefaultAtomexContextServicesSection;
    readonly providers: DefaultAtomexContextProvidersSection;
    constructor(atomexNetwork: AtomexNetwork);
}
declare class DefaultAtomexContextManagersSection implements AtomexContextManagersSection {
    readonly context: DefaultAtomexContext;
    private _walletsManager;
    private _authorizationManager;
    private _exchangeManager;
    private _swapManager;
    private _priceManager;
    private _balanceManager;
    constructor(context: DefaultAtomexContext);
    get walletsManager(): WalletsManager;
    private set walletsManager(value);
    get authorizationManager(): AuthorizationManager;
    private set authorizationManager(value);
    get exchangeManager(): ExchangeManager;
    private set exchangeManager(value);
    get swapManager(): SwapManager;
    private set swapManager(value);
    get priceManager(): PriceManager;
    private set priceManager(value);
    get balanceManager(): BalanceManager;
    private set balanceManager(value);
}
declare class DefaultAtomexContextServicesSection implements AtomexContextServicesSection {
    readonly context: DefaultAtomexContext;
    private _exchangeService;
    private _swapService;
    constructor(context: DefaultAtomexContext);
    get exchangeService(): ExchangeService;
    private set exchangeService(value);
    get swapService(): SwapService;
    private set swapService(value);
}
declare class DefaultAtomexContextProvidersSection implements AtomexContextProvidersSection {
    readonly context: DefaultAtomexContext;
    private _blockchainProvider;
    private _currenciesProvider;
    private _exchangeSymbolsProvider;
    private _orderBookProvider;
    constructor(context: DefaultAtomexContext);
    get blockchainProvider(): AtomexBlockchainProvider;
    private set blockchainProvider(value);
    get currenciesProvider(): CurrenciesProvider;
    private set currenciesProvider(value);
    get exchangeSymbolsProvider(): ManagedExchangeSymbolsProvider;
    private set exchangeSymbolsProvider(value);
    get orderBookProvider(): ManagedOrderBookProvider;
    private set orderBookProvider(value);
}
export {};
