import BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import type { PriceProvider } from '../../priceProvider/index';
import type { PriceManager } from '../priceManager';

export class MixedPriceManager implements PriceManager {
  constructor(
    private readonly providersMap: Map<string, PriceProvider>
  ) { }

  async getAveragePrice(baseCurrency: string, quoteCurrency: string): Promise<BigNumber | undefined> {
    const providers = this.getAvailableProviders();
    const pricePromises = providers.map(provider => this.getPrice(baseCurrency, quoteCurrency, provider));
    const pricePromiseResults = await Promise.allSettled(pricePromises);

    const prices: BigNumber[] = [];
    for (const result of pricePromiseResults)
      if (result.status === 'fulfilled' && result.value !== undefined)
        prices.push(result.value);

    return prices.length ? BigNumber.sum(...prices).div(prices.length) : undefined;
  }

  async getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id'], provider?: string): Promise<BigNumber | undefined> {
    let price = await this.getPriceCore(baseCurrency, quoteCurrency, provider);
    if (!price) {
      const reversedPrice = await this.getPriceCore(quoteCurrency, baseCurrency, provider);
      if (reversedPrice)
        price = reversedPrice.pow(-1);
    }

    return price;
  }

  getAvailableProviders(): string[] {
    return [...this.providersMap.keys()];
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
