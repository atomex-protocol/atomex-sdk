import type { AtomexBlockchainNetworkOptions } from '../atomex/models/atomexOptions';
import type { CurrenciesProvider, Currency } from '../common/index';
import type { AtomexProtocol } from './atomexProtocol';
import type { BalancesProvider } from './balancesProvider';
import type { BlockchainToolkitProvider } from './blockchainToolkitProvider';
import { ControlledCurrencyBalancesProvider } from './controlledCurrencyBalancesProvider';
import type { CurrencyBalanceProvider } from './currencyBalanceProvider';
import type { SwapTransactionsProvider } from './swapTransactionProvider';
export interface CurrencyInfo {
    currency: Currency;
    atomexProtocol: AtomexProtocol | undefined;
    blockchainToolkitProvider: BlockchainToolkitProvider;
    balanceProvider: CurrencyBalanceProvider;
    swapTransactionsProvider: SwapTransactionsProvider;
}
export declare class AtomexBlockchainProvider implements CurrenciesProvider {
    protected readonly currencyInfoMap: Map<Currency['id'], CurrencyInfo>;
    addBlockchain(networkOptions: AtomexBlockchainNetworkOptions): void;
    getCurrency(currencyId: Currency['id']): Currency | undefined;
    getCurrencyInfo(currencyId: Currency['id']): CurrencyInfo | undefined;
    protected createControlledBalancesProvider(currency: Currency, balancesProvider: BalancesProvider): ControlledCurrencyBalancesProvider;
}
