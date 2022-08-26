import { InMemoryExchangeSymbolsProvider, ManagedExchangeSymbolsProvider } from '../../../src/exchange';
import { resetAllMocks } from '../mockHelpers';

export class MockExchangeSymbolsProvider extends InMemoryExchangeSymbolsProvider implements ManagedExchangeSymbolsProvider {
  getSymbol = jest.fn<ReturnType<ManagedExchangeSymbolsProvider['getSymbol']>, Parameters<ManagedExchangeSymbolsProvider['getSymbol']>>(
    (...args: Parameters<ManagedExchangeSymbolsProvider['getSymbol']>) => super.getSymbol(...args)
  );
  getSymbols = jest.fn<ReturnType<ManagedExchangeSymbolsProvider['getSymbols']>, Parameters<ManagedExchangeSymbolsProvider['getSymbols']>>(
    (...args: Parameters<ManagedExchangeSymbolsProvider['getSymbols']>) => super.getSymbols(...args)
  );
  getSymbolsMap = jest.fn<ReturnType<ManagedExchangeSymbolsProvider['getSymbolsMap']>, Parameters<ManagedExchangeSymbolsProvider['getSymbolsMap']>>(
    (...args: Parameters<ManagedExchangeSymbolsProvider['getSymbolsMap']>) => super.getSymbolsMap(...args)
  );
  setSymbols = jest.fn<ReturnType<ManagedExchangeSymbolsProvider['setSymbols']>, Parameters<ManagedExchangeSymbolsProvider['setSymbols']>>(
    (...args: Parameters<ManagedExchangeSymbolsProvider['setSymbols']>) => super.setSymbols(...args)
  );

  resetAllMocks() {
    resetAllMocks(this);
  }
}
