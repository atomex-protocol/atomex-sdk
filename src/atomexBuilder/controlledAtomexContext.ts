import type { AuthorizationManager } from '../authorization/index';
import type { AtomexBlockchainProvider } from '../blockchain/atomexBlockchainProvider';
import type { WalletsManager } from '../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../common/index';
import type { AggregatedRatesProvider, ExchangeManager, ExchangeService, ManagedExchangeSymbolsProvider, ManagedOrderBookProvider } from '../exchange/index';
import type { SwapManager, SwapService } from '../swaps/index';

export interface ControlledAtomexContext {
  readonly id: number;
  readonly atomexNetwork: AtomexNetwork;

  readonly managers: ControlledAtomexContextManagersSection;
  readonly services: ControlledAtomexContextServicesSection;
  readonly providers: ControlledAtomexContextProvidersSection;
}

interface ControlledAtomexContextManagersSection {
  get walletsManager(): WalletsManager;
  set walletsManager(value: WalletsManager);

  get authorizationManager(): AuthorizationManager;
  set authorizationManager(value: AuthorizationManager);

  get exchangeManager(): ExchangeManager;
  set exchangeManager(value: ExchangeManager);

  get swapManager(): SwapManager;
  set swapManager(value: SwapManager);
}

interface ControlledAtomexContextServicesSection {
  get exchangeService(): ExchangeService;
  set exchangeService(value: ExchangeService);

  get swapService(): SwapService;
  set swapService(value: SwapService);
}

interface ControlledAtomexContextProvidersSection {
  get blockchainProvider(): AtomexBlockchainProvider;
  set blockchainProvider(value: AtomexBlockchainProvider);

  get currenciesProvider(): CurrenciesProvider;
  set currenciesProvider(value: CurrenciesProvider);

  get exchangeSymbolsProvider(): ManagedExchangeSymbolsProvider;
  set exchangeSymbolsProvider(value: ManagedExchangeSymbolsProvider);

  get orderBookProvider(): ManagedOrderBookProvider;
  set orderBookProvider(value: ManagedOrderBookProvider);

  get ratesProvider(): AggregatedRatesProvider;
  set ratesProvider(value: AggregatedRatesProvider);
}
