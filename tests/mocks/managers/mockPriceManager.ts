import type { PriceManager } from '../../../src/exchange';

export class MockPriceManager implements PriceManager {
  getPrice = jest.fn<ReturnType<PriceManager['getPrice']>, Parameters<PriceManager['getPrice']>>();
  getAveragePrice = jest.fn<ReturnType<PriceManager['getAveragePrice']>, Parameters<PriceManager['getAveragePrice']>>();
  getAvailableProviders = jest.fn<ReturnType<PriceManager['getAvailableProviders']>, Parameters<PriceManager['getAvailableProviders']>>();
  dispose = jest.fn<ReturnType<PriceManager['dispose']>, Parameters<PriceManager['dispose']>>();
}
