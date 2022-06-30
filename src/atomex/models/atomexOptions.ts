import type { AuthorizationManager } from '../../authorization';
import type { AtomexProtocol, BalancesProvider, Signer, SwapTransactionsProvider } from '../../blockchain';
import type { AtomexClient } from '../../clients';
import { AtomexNetwork, CurrenciesProvider } from '../../common';
import type { AtomexStore } from '../../stores';

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
