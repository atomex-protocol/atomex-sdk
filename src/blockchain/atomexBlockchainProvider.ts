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

export class AtomexBlockchainProvider {
  protected readonly currencyInfoMap: Map<Currency['id'], CurrencyInfo> = new Map();

  addBlockchain(networkOptions: AtomexBlockchainNetworkOptions) {
    for (const currency of networkOptions.currencies) {
      if (this.currencyInfoMap.has(currency.id))
        throw new Error('There is already currency added with the same key');

      const currencyOptions = networkOptions.currencyOptions[currency.id];
      const options: CurrencyInfo = {
        currency,
        atomexProtocol: currencyOptions?.atomexProtocol,
        blockchainToolkitProvider: networkOptions.blockchainToolkitProvider,
        balanceProvider: currencyOptions?.currencyBalanceProvider ?? this.getControlledBalancesProvider(currency, networkOptions.balancesProvider),
        swapTransactionsProvider: currencyOptions?.swapTransactionsProvider ?? networkOptions.swapTransactionsProvider,
      };
      this.currencyInfoMap.set(currency.id, options);
    }
  }

  getCurrencyInfo(currencyId: Currency['id']): CurrencyInfo | undefined {
    const options = this.currencyInfoMap.get(currencyId);

    return options;
  }

  protected getControlledBalancesProvider(currency: Currency, balancesProvider: BalancesProvider): ControlledCurrencyBalancesProvider {
    return new ControlledCurrencyBalancesProvider(
      currency,
      (address: string) => balancesProvider.getBalance(address, currency)
    );
  }
}
