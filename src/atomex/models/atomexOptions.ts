import type { AuthorizationManager } from '../../authorization/index';
import type { AtomexProtocol, BalancesProvider, Signer, SwapTransactionsProvider } from '../../blockchain/index';
import type { AtomexClient } from '../../clients/index';
import { AtomexNetwork, CurrenciesProvider } from '../../common/index';
import type { AtomexStore } from '../../stores/index';

export interface AtomexOptions {
  network: AtomexNetwork;
  client: AtomexClient;
  store: AtomexStore;
  currenciesProvider: CurrenciesProvider;
  authorizationManager: AuthorizationManager;
  blockchains: {
    [blockchain: string]: {
      [network: string]: AtomexBlockchainOptions;
    }
  }
}

export interface AtomexBlockchainOptions {
  atomexProtocol: AtomexProtocol;
  signer: Signer;
  providers: AtomexProviders;
}

export interface AtomexProviders {
  balancesProvider: BalancesProvider;
  swapTransactionsProvider: SwapTransactionsProvider;
}
