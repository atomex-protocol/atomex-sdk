import BigNumber from 'bignumber.js';

import type { Currency } from '../../../common';
import type { RatesService } from '../../ratesService/index';
import type { PriceManager } from '../priceManager';

export class MixedPriceManager implements PriceManager {
  constructor(
    private readonly servicesMap: Map<string, RatesService>
  ) { }

  async getAveragePrice(baseCurrency: string, quoteCurrency: string): Promise<BigNumber | undefined> {
    const services = this.getAvailableProviders();
    const pricePromises = services.map(service => this.getPrice(baseCurrency, quoteCurrency, service));
    const pricePromiseResults = await Promise.allSettled(pricePromises);

    const prices: BigNumber[] = [];
    for (const result of pricePromiseResults)
      if (result.status === 'fulfilled' && result.value !== undefined)
        prices.push(result.value);

    return prices.length ? BigNumber.sum(...prices).div(prices.length) : undefined;
  }

  async getPrice(baseCurrency: Currency['id'], quoteCurrency: Currency['id'], service?: string): Promise<BigNumber | undefined> {
    let price = await this.getPriceCore(baseCurrency, quoteCurrency, service);
    if (!price) {
      const reversedPrice = await this.getPriceCore(quoteCurrency, baseCurrency, service);
      if (reversedPrice)
        price = reversedPrice.pow(-1);
    }

    return price;
  }

  getAvailableProviders(): string[] {
    return [...this.servicesMap.keys()];
  }

  private async getPriceCore(baseCurrency: Currency['id'], quoteCurrency: Currency['id'], service?: string): Promise<BigNumber | undefined> {
    const services = this.getSelectedServices(service);
    const pricePromises = services.map(service => service.getPrice(baseCurrency, quoteCurrency));
    const pricePromiseResults = await Promise.allSettled(pricePromises);

    for (const result of pricePromiseResults)
      if (result.status === 'fulfilled' && result.value !== undefined)
        return result.value;

    return undefined;
  }

  private getSelectedServices(service?: string): RatesService[] {
    if (!service)
      return [...this.servicesMap.values()];

    const selectedService = this.servicesMap.get(service);
    if (!selectedService)
      throw new Error(`Service not found for key: ${service}`);

    return [selectedService];
  }
}
