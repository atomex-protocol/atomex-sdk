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

export class AtomexBlockchainProvider implements CurrenciesProvider {
  protected readonly currencyInfoMap: Map<Currency['id'], CurrencyInfo> = new Map();
  protected readonly blockchainToolkitProviderMap: Map<string, BlockchainToolkitProvider> = new Map();

  addBlockchain(blockchain: string, networkOptions: AtomexBlockchainNetworkOptions) {
    if (this.blockchainToolkitProviderMap.has(blockchain))
      throw new Error('There is already blockchain added with the same key');

    this.blockchainToolkitProviderMap.set(blockchain, networkOptions.blockchainToolkitProvider);

    for (const currency of networkOptions.currencies) {
      if (this.currencyInfoMap.has(currency.id))
        throw new Error('There is already currency added with the same key');

      const currencyOptions = networkOptions.currencyOptions[currency.id];
      const options: CurrencyInfo = {
        currency,
        atomexProtocol: currencyOptions?.atomexProtocol,
        blockchainToolkitProvider: networkOptions.blockchainToolkitProvider,
        balanceProvider: currencyOptions?.currencyBalanceProvider ?? this.createControlledBalancesProvider(currency, networkOptions.balancesProvider),
        swapTransactionsProvider: currencyOptions?.swapTransactionsProvider ?? networkOptions.swapTransactionsProvider,
      };
      this.currencyInfoMap.set(currency.id, options);
    }
  }

  getCurrency(currencyId: Currency['id']): Currency | undefined {
    return this.getCurrencyInfo(currencyId)?.currency;
  }

  getBlockchainToolkitProvider(blockchain: string): BlockchainToolkitProvider | undefined {
    return this.blockchainToolkitProviderMap.get(blockchain);
  }

  getReadonlyToolkit(blockchain: string, toolkitId: string): Promise<unknown | undefined> {
    const provider = this.blockchainToolkitProviderMap.get(blockchain);
    if (!provider || provider.toolkitId !== toolkitId)
      return Promise.resolve(undefined);

    return provider.getReadonlyToolkit();
  }

  getToolkit(blockchain: string, toolkitId: string, address?: string): Promise<unknown | undefined> {
    const provider = this.blockchainToolkitProviderMap.get(blockchain);
    if (!provider || provider.toolkitId !== toolkitId)
      return Promise.resolve(undefined);

    return provider.getToolkit(address);
  }

  getCurrencyInfo(currencyId: Currency['id']): CurrencyInfo | undefined {
    const options = this.currencyInfoMap.get(currencyId);

    return options;
  }

  protected createControlledBalancesProvider(currency: Currency, balancesProvider: BalancesProvider): ControlledCurrencyBalancesProvider {
    return new ControlledCurrencyBalancesProvider(
      currency,
      (address: string) => balancesProvider.getBalance(address, currency)
    );
  }
}
