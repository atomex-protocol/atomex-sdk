import type { AtomexBlockchainNetworkOptions } from '../atomex/models/atomexOptions';
import type { CurrenciesProvider, Currency } from '../common/index';
import type { AtomexProtocol } from './atomexProtocol';
import { ControlledCurrencyBalancesProvider, CurrencyBalanceProvider, BalancesProvider } from './balanceProvider/index';
import type { BlockchainToolkitProvider } from './blockchainToolkitProvider';
import type { SwapTransactionsProvider } from './swapTransactionProvider';
export interface CurrencyInfo {
    currency: Currency;
    atomexProtocol: AtomexProtocol;
    blockchainToolkitProvider: BlockchainToolkitProvider;
    balanceProvider: CurrencyBalanceProvider;
    swapTransactionsProvider: SwapTransactionsProvider;
}
export declare class AtomexBlockchainProvider implements CurrenciesProvider {
    protected readonly currencyInfoMap: Map<Currency['id'], CurrencyInfo>;
    protected readonly networkOptionsMap: Map<string, AtomexBlockchainNetworkOptions>;
    protected readonly blockchainToolkitProviders: Set<BlockchainToolkitProvider>;
    addBlockchain(blockchain: string, networkOptions: AtomexBlockchainNetworkOptions): void;
    getNetworkOptions(blockchain: string): AtomexBlockchainNetworkOptions | undefined;
    getReadonlyToolkit<Toolkit = unknown>(toolkitId: string, blockchain?: string): Promise<Toolkit | undefined>;
    getCurrency(currencyId: Currency['id']): Currency | undefined;
    getNativeCurrencyInfo(blockchain: string): CurrencyInfo | undefined;
    getCurrencyInfo(currencyId: Currency['id']): CurrencyInfo | undefined;
    protected createControlledBalancesProvider(currency: Currency, balancesProvider: BalancesProvider): ControlledCurrencyBalancesProvider;
}
