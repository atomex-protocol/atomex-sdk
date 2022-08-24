import type { AtomexContext } from '../../src/atomex';
import { CachedBalanceManager } from '../../src/blockchain/balanceManager';
import { AtomexNetwork, AuthorizationManager } from '../../src/index';
import { MockExchangeManager, MockSwapManager, MockWalletsManager } from './managers';
import { MockAtomexClient } from './mockAtomexClient';
import { MockBlockchainProvider, MockExchangeSymbolsProvider, MockOrderBookProvider } from './providers';
import { MockAuthorizationManagerStore } from './stores';

export interface MockAtomexContext {
  id: number;
  atomexNetwork: AtomexNetwork;

  managers: MockAtomexContextManagersSection;
  services: MockAtomexContextServicesSection;
  providers: MockAtomexContextProvidersSection;
}

interface MockAtomexContextManagersSection {
  walletsManager: MockWalletsManager;
  authorizationManager: AtomexContext['managers']['authorizationManager'];
  exchangeManager: MockExchangeManager;
  swapManager: AtomexContext['managers']['swapManager'];
  balanceManger: AtomexContext['managers']['balanceManager'];
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
  const mockedAtomexContext = new MockAtomexClient(atomexNetwork);
  const walletsManager = new MockWalletsManager(atomexNetwork);
  const orderBookProvider = new MockOrderBookProvider();
  const symbolsProvider = new MockExchangeSymbolsProvider();
  const blockchainProvider = new MockBlockchainProvider();

  return {
    atomexNetwork,
    id,
    managers: {
      walletsManager,
      authorizationManager: new AuthorizationManager({
        atomexNetwork,
        walletsManager,
        authorizationBaseUrl: 'https://atomex.authorization.url',
        store: new MockAuthorizationManagerStore()
      }),
      exchangeManager: new MockExchangeManager({
        exchangeService: mockedAtomexContext,
        orderBookProvider,
        symbolsProvider
      }),
      swapManager: new MockSwapManager(mockedAtomexContext),
      balanceManger: new CachedBalanceManager(blockchainProvider)
    },
    providers: {
      blockchainProvider,
      currenciesProvider: blockchainProvider,
      exchangeSymbolsProvider: symbolsProvider,
      orderBookProvider,
    },
    services: {
      exchangeService: mockedAtomexContext,
      swapService: mockedAtomexContext,
    }
  };
};
