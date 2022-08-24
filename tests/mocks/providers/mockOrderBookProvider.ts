import { InMemoryOrderBookProvider, ManagedOrderBookProvider } from '../../../src/exchange';
import { resetAllMocks } from '../mockHelpers';

export class MockOrderBookProvider extends InMemoryOrderBookProvider implements ManagedOrderBookProvider {
  getOrderBook = jest.fn<ReturnType<ManagedOrderBookProvider['getOrderBook']>, Parameters<ManagedOrderBookProvider['getOrderBook']>>(
    (...args: Parameters<ManagedOrderBookProvider['getOrderBook']>) => super.getOrderBook(...args)
  );

  setOrderBook = jest.fn<ReturnType<ManagedOrderBookProvider['setOrderBook']>, Parameters<ManagedOrderBookProvider['setOrderBook']>>(
    (...args: Parameters<ManagedOrderBookProvider['setOrderBook']>) => super.setOrderBook(...args)
  );

  resetAllMocks() {
    resetAllMocks(this);
  }
}
