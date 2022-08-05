import type { AtomexBlockchainNetworkOptions } from '../atomex/models/atomexOptions';
import type { Currency } from '../common/index';
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
export declare class AtomexBlockchainProvider {
    protected readonly currencyInfoMap: Map<Currency['id'], CurrencyInfo>;
    addBlockchain(networkOptions: AtomexBlockchainNetworkOptions): void;
    getCurrencyInfo(currencyId: Currency['id']): CurrencyInfo | undefined;
    protected createControlledBalancesProvider(currency: Currency, balancesProvider: BalancesProvider): ControlledCurrencyBalancesProvider;
}
