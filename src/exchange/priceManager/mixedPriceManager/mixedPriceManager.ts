import BigNumber from 'bignumber.js';

import { Currency, DataSource } from '../../../common';
import { Cache, InMemoryCache } from '../../../core/index';
import type { PriceProvider } from '../../priceProvider/index';
import type { GetAveragePriceParameters, GetPriceParameters, PriceManager } from '../priceManager';

interface GetCacheKeyParameters {
  isAverage: boolean;
  baseCurrency: Currency['id'];
  quoteCurrency: Currency['id'];
  provider?: string;
}

export class MixedPriceManager implements PriceManager {
  private static readonly cacheExpirationTime = 1000 * 60 * 1;

  private readonly cache: Cache;
  constructor(
    private readonly providersMap: Map<string, PriceProvider>
  ) {
    this.cache = new InMemoryCache({ absoluteExpirationMs: MixedPriceManager.cacheExpirationTime });
  }

  async getAveragePrice({ baseCurrency, quoteCurrency, dataSource = DataSource.All }: GetAveragePriceParameters): Promise<BigNumber | undefined> {
    const key = this.getCacheKey({ isAverage: true, baseCurrency, quoteCurrency });
    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const cachedAveragePrice = this.cache.get<BigNumber>(key);
      if (cachedAveragePrice)
        return cachedAveragePrice;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      const providers = this.getAvailableProviders();
      const pricePromises = providers.map(provider => this.getPrice({ baseCurrency, quoteCurrency, provider }));
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

  async getPrice({ baseCurrency, quoteCurrency, provider, dataSource = DataSource.All }: GetPriceParameters): Promise<BigNumber | undefined> {
    const key = this.getCacheKey({ isAverage: false, baseCurrency, quoteCurrency, provider });
    if ((dataSource & DataSource.Local) === DataSource.Local) {
      const cachedPrice = this.cache.get<BigNumber>(key);
      if (cachedPrice)
        return cachedPrice;
    }

    if ((dataSource & DataSource.Remote) === DataSource.Remote) {
      let price = await this.getPriceCore(baseCurrency, quoteCurrency, provider);
      if (!price) {
        const reversedPrice = await this.getPriceCore(quoteCurrency, baseCurrency, provider);
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

  dispose(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getCacheKey({ isAverage, baseCurrency, quoteCurrency, provider }: GetCacheKeyParameters) {
    const prefix = isAverage ? 'average' : 'actual';
    const postfix = provider ? provider : '';

    return `${prefix}_${baseCurrency}_${quoteCurrency}_${postfix}`;
  }

  private async getPriceCore(baseCurrency: Currency['id'], quoteCurrency: Currency['id'], provider?: string): Promise<BigNumber | undefined> {
    const providers = this.getSelectedProviders(provider);
    const pricePromises = providers.map(provider => provider.getPrice(baseCurrency, quoteCurrency));
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
