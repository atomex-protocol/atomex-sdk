import type BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import type { AggregatedRatesProvider } from '../aggregatedRatesProvider';
import type { RatesProvider } from '../ratesProvider';

export class MixedRatesProvider implements AggregatedRatesProvider {
  constructor(
    private readonly providersMap: Map<string, RatesProvider>
  ) { }

  async getPrice(quoteCurrency: Currency['id'], baseCurrency: Currency['id'], provider?: string): Promise<BigNumber | undefined> {
    const providers = this.getSelectedProviders(provider);
    const pricePromises = providers.map(p => p.getPrice(quoteCurrency, baseCurrency));
    const pricePromiseResults = await Promise.allSettled(pricePromises);

    for (const result of pricePromiseResults)
      if (result.status === 'fulfilled' && result.value !== undefined)
        return result.value;

    return undefined;
  }

  getAvailableProviders(): string[] {
    return [...this.providersMap.keys()];
  }

  private getSelectedProviders(provider?: string): RatesProvider[] {
    if (!provider)
      return [...this.providersMap.values()];

    const selectedProvider = this.providersMap.get(provider);
    if (!selectedProvider)
      throw new Error(`Provider not found for key: ${provider}`);

    return [selectedProvider];
  }
}
