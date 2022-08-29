import type { AtomexContext } from '../../src/atomex/index';
import type { AtomexNetwork } from '../../src/index';
import { MockAuthorizationManager, MockBalanceManager, MockExchangeManager, MockPriceManager, MockSwapManager, MockWalletsManager } from './managers';
import { MockAtomexClient } from './mockAtomexClient';
import { MockBlockchainProvider, MockExchangeSymbolsProvider, MockOrderBookProvider } from './providers';
import { MockAuthorizationManagerStore } from './stores';

export interface MockAtomexContext extends AtomexContext {
  managers: MockAtomexContextManagersSection;
  services: MockAtomexContextServicesSection;
  providers: MockAtomexContextProvidersSection;
}

interface MockAtomexContextManagersSection {
  walletsManager: MockWalletsManager;
  authorizationManager: MockAuthorizationManager;
  exchangeManager: MockExchangeManager;
  swapManager: MockSwapManager;
  priceManager: MockPriceManager;
  balanceManager: MockBalanceManager;
}

interface MockAtomexContextServicesSection {
  exchangeService: MockAtomexClient;
  swapService: MockAtomexClient;
}

interface MockAtomexContextProvidersSection {
  blockchainProvider: MockBlockchainProvider;
  currenciesProvider: MockBlockchainProvider;
  exchangeSymbolsProvider: MockExchangeSymbolsProvider;
  orderBookProvider: MockOrderBookProvider;
}

export const createMockedAtomexContext = (atomexNetwork: AtomexNetwork, id = 0): MockAtomexContext => {
  const mockAtomexClient = new MockAtomexClient(atomexNetwork);
  const walletsManager = new MockWalletsManager(atomexNetwork);
  const orderBookProvider = new MockOrderBookProvider();
  const symbolsProvider = new MockExchangeSymbolsProvider();
  const blockchainProvider = new MockBlockchainProvider();
  const authorizationManager = new MockAuthorizationManager({
    atomexNetwork,
    walletsManager,
    authorizationBaseUrl: 'https://atomex.authorization.url',
    store: new MockAuthorizationManagerStore()
  });

  return {
    atomexNetwork,
    id,
    managers: {
      walletsManager,
      authorizationManager,
      exchangeManager: new MockExchangeManager({
        authorizationManager,
        exchangeService: mockAtomexClient,
        orderBookProvider,
        symbolsProvider
      }),
      swapManager: new MockSwapManager(mockAtomexClient),
      balanceManager: new MockBalanceManager(blockchainProvider),
      priceManager: new MockPriceManager()
    },
    providers: {
      blockchainProvider,
      currenciesProvider: blockchainProvider,
      exchangeSymbolsProvider: symbolsProvider,
      orderBookProvider,
    },
    services: {
      exchangeService: mockAtomexClient,
      swapService: mockAtomexClient,
    }
  };
};
