import type { AuthorizationManager } from '../authorization/index';
import type { BalanceManager } from '../blockchain/balanceManager';
import type { WalletsManager, AtomexBlockchainProvider } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { ExchangeManager, ExchangeService, ManagedExchangeSymbolsProvider, ManagedOrderBookProvider, PriceManager } from '../exchange/index';
import type { SwapManager, SwapService } from '../swaps/index';
export interface AtomexContext {
    readonly id: number;
    readonly atomexNetwork: AtomexNetwork;
    readonly managers: AtomexContextManagersSection;
    readonly services: AtomexContextServicesSection;
    readonly providers: AtomexContextProvidersSection;
}
export interface AtomexContextManagersSection {
    get walletsManager(): WalletsManager;
    get authorizationManager(): AuthorizationManager;
    get exchangeManager(): ExchangeManager;
    get swapManager(): SwapManager;
    get priceManager(): PriceManager;
    get balanceManager(): BalanceManager;
}
export interface AtomexContextServicesSection {
    get exchangeService(): ExchangeService;
    get swapService(): SwapService;
}
export interface AtomexContextProvidersSection {
    get blockchainProvider(): AtomexBlockchainProvider;
    get currenciesProvider(): CurrenciesProvider;
    get exchangeSymbolsProvider(): ManagedExchangeSymbolsProvider;
    get orderBookProvider(): ManagedOrderBookProvider;
}
export declare class AtomexComponentNotResolvedError extends Error {
    readonly name: string;
    readonly componentName: string;
    constructor(componentName: string);
    private static getMessage;
}
