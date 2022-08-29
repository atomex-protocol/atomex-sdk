import BigNumber from 'bignumber.js';

import { CurrenciesProvider, Currency, DataSource } from '../../../common';
import { Cache, InMemoryCache } from '../../../core/index';
import type { PriceProvider } from '../../priceProvider/index';
import type { GetAveragePriceParameters, GetPriceParameters, PriceManager } from '../priceManager';

interface GetCacheKeyParameters {
  isAverage: boolean;
  baseCurrencyOrSymbol: Currency | Currency['id'];
  quoteCurrencyOrSymbol: Currency | Currency['id'];
  provider?: string;
}

export class MixedPriceManager implements PriceManager {
  private readonly cache: Cache = new InMemoryCache({ absoluteExpirationMs: 1000 * 30 });

  constructor(
    private readonly currenciesProvider: CurrenciesProvider,
    private readonly providersMap: Map<string, PriceProvider>
  ) { }

  async getAveragePrice({ baseCurrencyOrIdOrSymbol, quoteCurrencyOrIdOrSymbol, dataSource = DataSource.All }: GetAveragePriceParameters): Promise<BigNumber | undefined> {
    const baseCurrencyOrSymbol = this.tryFindCurrency(baseCurrencyOrIdOrSymbol);
    const quoteCurrencyOrSymbol = this.tryFindCurrency(quoteCurrencyOrIdOrSymbol);

    const key = this.getCacheKey({ isAverage: true, baseCurrencyOrSymbol, quoteCurrencyOrSymbol });
    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const cachedAveragePrice = this.cache.get<BigNumber>(key);
      if (cachedAveragePrice)
        return cachedAveragePrice;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      const providers = this.getAvailableProviders();
      const pricePromises = providers.map(provider => this.getPrice({
        baseCurrencyOrIdOrSymbol: baseCurrencyOrSymbol,
        quoteCurrencyOrIdOrSymbol: quoteCurrencyOrSymbol,
        provider,
        dataSource
      }));
      const pricePromiseResults = await Promise.allSettled(pricePromises);

      const prices: BigNumber[] = [];
      for (const result of pricePromiseResults)
        if (result.status === 'fulfilled' && result.value !== undefined)
          prices.push(result.value);

      if (prices.length) {
        const averagePrice = BigNumber.sum(...prices).div(prices.length);
        this.cache.set(key, averagePrice);
        return averagePrice;
      }
    }

    return undefined;
  }

  async getPrice({ baseCurrencyOrIdOrSymbol, quoteCurrencyOrIdOrSymbol, provider, dataSource = DataSource.All }: GetPriceParameters): Promise<BigNumber | undefined> {
    const baseCurrencyOrSymbol = this.tryFindCurrency(baseCurrencyOrIdOrSymbol);
    const quoteCurrencyOrSymbol = this.tryFindCurrency(quoteCurrencyOrIdOrSymbol);

    const key = this.getCacheKey({ isAverage: false, baseCurrencyOrSymbol, quoteCurrencyOrSymbol, provider });
    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const cachedPrice = this.cache.get<BigNumber>(key);
      if (cachedPrice)
        return cachedPrice;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      let price = await this.getPriceCore(baseCurrencyOrSymbol, quoteCurrencyOrSymbol, provider);
      if (!price) {
        const reversedPrice = await this.getPriceCore(quoteCurrencyOrSymbol, baseCurrencyOrSymbol, provider);
        if (reversedPrice)
          price = reversedPrice.pow(-1);
      }

      if (price) {
        this.cache.set(key, price);
        return price;
      }
    }

    return undefined;
  }

  getAvailableProviders(): string[] {
    return [...this.providersMap.keys()];
  }

  async dispose(): Promise<void> {
    this.cache.clear();
  }

  private tryFindCurrency(baseCurrencyOrIdOrSymbol: Currency | Currency['id']): Currency | string {
    if (typeof baseCurrencyOrIdOrSymbol !== 'string')
      return baseCurrencyOrIdOrSymbol;

    return this.currenciesProvider.getCurrency(baseCurrencyOrIdOrSymbol) || baseCurrencyOrIdOrSymbol;
  }

  private getCacheKey({ isAverage, baseCurrencyOrSymbol, quoteCurrencyOrSymbol, provider }: GetCacheKeyParameters) {
    const prefix = isAverage ? 'average' : 'actual';
    const baseCurrencySymbol = typeof baseCurrencyOrSymbol === 'string' ? baseCurrencyOrSymbol : baseCurrencyOrSymbol.id;
    const quoteCurrencySymbol = typeof quoteCurrencyOrSymbol === 'string' ? quoteCurrencyOrSymbol : quoteCurrencyOrSymbol.id;
    const postfix = provider ? provider : '';

    return `${prefix}_${baseCurrencySymbol}_${quoteCurrencySymbol}_${postfix}`;
  }

  private async getPriceCore(baseCurrencyOrSymbol: Currency | string, quoteCurrencyOrSymbol: Currency | string, provider?: string): Promise<BigNumber | undefined> {
    const providers = this.getSelectedProviders(provider);
    const pricePromises = providers.map(provider => provider.getPrice(baseCurrencyOrSymbol, quoteCurrencyOrSymbol));
    const pricePromiseResults = await Promise.allSettled(pricePromises);

    for (const result of pricePromiseResults)
      if (result.status === 'fulfilled' && result.value !== undefined)
        return result.value;

    return undefined;
  }

  private getSelectedProviders(provider?: string): PriceProvider[] {
    if (!provider)
      return [...this.providersMap.values()];

    const selectedProvider = this.providersMap.get(provider);
    if (!selectedProvider)
      throw new Error(`Provider not found for key: ${provider}`);

    return [selectedProvider];
  }
}
