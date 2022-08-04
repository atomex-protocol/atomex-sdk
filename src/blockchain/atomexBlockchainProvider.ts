import type { AtomexBlockchainNetworkOptions } from '../atomex/models/atomexOptions';
import type { Currency } from '../common/index';
import type { AtomexProtocol } from './atomexProtocol';
import type { BalancesProvider } from './balancesProvider';
import type { BlockchainToolkitProvider } from './blockchainToolkitProvider';
import type { CurrencyBalanceProvider } from './currencyBalanceProvider';
import type { SwapTransactionsProvider } from './swapTransactionProvider';

export interface CurrencyInfo {
  currency: Currency;
  atomexProtocol: AtomexProtocol | undefined;
  blockchainToolkitProvider: BlockchainToolkitProvider | undefined;
  balanceProvider: BalancesProvider | CurrencyBalanceProvider | undefined;
  swapTransactionsProvider: SwapTransactionsProvider | undefined;
}

export class AtomexBlockchainProvider {
  protected readonly optionsMap: Map<Currency['id'], CurrencyInfo> = new Map();

  addBlockchain(networkOptions: AtomexBlockchainNetworkOptions) {
    for (const currency of networkOptions.currencies) {
      if (this.optionsMap.has(currency.id))
        throw new Error('There is already currency added with the same key');

      const currencyOptions = networkOptions.currencyOptions[currency.id];
      const options: CurrencyInfo = {
        currency,
        atomexProtocol: currencyOptions?.atomexProtocol,
        blockchainToolkitProvider: networkOptions.blockchainToolkitProvider,
        balanceProvider: currencyOptions?.currencyBalanceProvider ?? networkOptions.balancesProvider,
        swapTransactionsProvider: currencyOptions?.swapTransactionsProvider ?? networkOptions.swapTransactionsProvider,
      };
      this.optionsMap.set(currency.id, options);
    }
  }

  getCurrencyInfo(currencyId: Currency['id']): CurrencyInfo | undefined {
    const options = this.optionsMap.get(currencyId);

    return options;
  }
}
