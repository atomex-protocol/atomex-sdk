import type { AuthorizationManager } from '../../authorization/index';
import type { AtomexProtocol, BalancesProvider, SignersManager, SwapTransactionsProvider } from '../../blockchain/index';
import { AtomexNetwork, CurrenciesProvider } from '../../common/index';
import type { ExchangeService } from '../../exchange/index';
export interface AtomexOptions {
    atomexNetwork: AtomexNetwork;
    authorizationManager: AuthorizationManager;
    signersManager: SignersManager;
    providers: AtomexProviders;
    services: AtomexServices;
    blockchains: {
        [blockchain: string]: {
            [network: string]: AtomexBlockchainOptions;
        };
    };
}
export interface AtomexProviders {
    currenciesProvider: CurrenciesProvider;
}
export interface AtomexServices {
    exchangeService: ExchangeService;
}
export interface AtomexBlockchainOptions {
    atomexProtocol: AtomexProtocol;
    providers: AtomexBlockchainProviders;
}
export interface AtomexBlockchainProviders {
    balancesProvider: BalancesProvider;
    swapTransactionsProvider: SwapTransactionsProvider;
}
