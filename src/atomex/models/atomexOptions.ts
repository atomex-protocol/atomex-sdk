import type { AuthorizationManager } from '../../authorization/index';
import type {
  AtomexProtocol, BalancesProvider, BlockchainToolkitProvider,
  CurrencyBalanceProvider, WalletsManager, SwapTransactionsProvider
} from '../../blockchain/index';
import type { Currency } from '../../common/index';
import type { ExchangeManager, ExchangeService } from '../../exchange/index';
import type { SwapManager } from '../../swaps/index';
import type { AtomexContext } from '../atomexContext';

export interface AtomexOptions {
  atomexContext: AtomexContext;
  managers: AtomexManagers;
  blockchains?: Record<string, AtomexBlockchainOptions>;
}

export interface AtomexManagers {
  authorizationManager: AuthorizationManager;
  walletsManager: WalletsManager;
  exchangeManager: ExchangeManager;
  swapManager: SwapManager;
}

export interface AtomexServices {
  exchangeService: ExchangeService;
}

export interface AtomexBlockchainOptions {
  mainnet: AtomexBlockchainNetworkOptions;
  testnet?: AtomexBlockchainNetworkOptions;
}

export interface AtomexBlockchainNetworkOptions {
  rpcUrl: string;
  blockchainToolkitProvider: BlockchainToolkitProvider;
  balancesProvider: BalancesProvider;
  swapTransactionsProvider: SwapTransactionsProvider;
  currencies: Currency[];
  currencyOptions: Record<Currency['id'], AtomexCurrencyOptions>;
  [name: string | number]: unknown;
}

export interface AtomexCurrencyOptions {
  atomexProtocol: AtomexProtocol;
  currencyBalanceProvider?: CurrencyBalanceProvider;
  swapTransactionsProvider?: SwapTransactionsProvider;
  [name: string | number]: unknown;
}
