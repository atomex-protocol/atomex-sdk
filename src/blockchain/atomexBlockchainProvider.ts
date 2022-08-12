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
  protected readonly networkOptionsMap: Map<string, AtomexBlockchainNetworkOptions> = new Map();
  protected readonly blockchainToolkitProviders: Set<BlockchainToolkitProvider> = new Set();

  addBlockchain(blockchain: string, networkOptions: AtomexBlockchainNetworkOptions) {
    if (this.networkOptionsMap.has(blockchain))
      throw new Error('There is already blockchain added with the same key');

    this.networkOptionsMap.set(blockchain, networkOptions);
    this.blockchainToolkitProviders.add(networkOptions.blockchainToolkitProvider);

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

  getNetworkOptions(blockchain: string): AtomexBlockchainNetworkOptions | undefined {
    return this.networkOptionsMap.get(blockchain);
  }

  getCurrency(currencyId: Currency['id']): Currency | undefined {
    return this.getCurrencyInfo(currencyId)?.currency;
  }

  async getReadonlyToolkit<Toolkit = unknown>(toolkitId: string, blockchain?: string): Promise<Toolkit | undefined> {
    const providerToolkitPromises: Array<Promise<unknown | undefined>> = [];
    for (const provider of this.blockchainToolkitProviders) {
      if (provider.toolkitId === toolkitId)
        providerToolkitPromises.push(provider.getReadonlyToolkit(blockchain));
    }

    const providerToolkitResults = await Promise.all(providerToolkitPromises);
    for (const providerResult of providerToolkitResults) {
      if (providerResult)
        return providerResult as Toolkit;
    }

    return Promise.resolve(undefined);
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
