import type { AtomexContext, AtomexContextManagersSection, AtomexContextProvidersSection, AtomexContextServicesSection } from '../atomex/atomexContext';
import type { AuthorizationManager } from '../authorization/index';
import type { AtomexBlockchainProvider } from '../blockchain/atomexBlockchainProvider';
import type { BalanceManager } from '../blockchain/balanceManager';
import type { WalletsManager } from '../blockchain/index';
import type { CurrenciesProvider } from '../common/index';
import type { ExchangeManager, ExchangeService, ManagedExchangeSymbolsProvider, ManagedOrderBookProvider, PriceManager } from '../exchange/index';
import type { SwapManager, SwapService } from '../swaps/index';

export interface ControlledAtomexContext extends AtomexContext {
  readonly managers: ControlledAtomexContextManagersSection;
  readonly services: ControlledAtomexContextServicesSection;
  readonly providers: ControlledAtomexContextProvidersSection;
}

interface ControlledAtomexContextManagersSection extends AtomexContextManagersSection {
  set walletsManager(value: WalletsManager);
  set authorizationManager(value: AuthorizationManager);
  set exchangeManager(value: ExchangeManager);
  set swapManager(value: SwapManager);
  set priceManager(value: PriceManager);
  set balanceManager(value: BalanceManager);
}

interface ControlledAtomexContextServicesSection extends AtomexContextServicesSection {
  set exchangeService(value: ExchangeService);
  set swapService(value: SwapService);
}

interface ControlledAtomexContextProvidersSection extends AtomexContextProvidersSection {
  set blockchainProvider(value: AtomexBlockchainProvider);
  set currenciesProvider(value: CurrenciesProvider);
  set exchangeSymbolsProvider(value: ManagedExchangeSymbolsProvider);
  set orderBookProvider(value: ManagedOrderBookProvider);
}
