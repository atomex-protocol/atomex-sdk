import type { ExchangeSymbol } from '../models/exchangeSymbol';
import type { ManagedExchangeSymbolsProvider } from './exchangeSymbolsProvider';

export class InMemoryExchangeSymbolsProvider implements ManagedExchangeSymbolsProvider {
  private symbolsMap: Map<ExchangeSymbol['name'], ExchangeSymbol> = new Map();
  private symbolsCollectionCache: readonly ExchangeSymbol[] = [];

  getSymbol(name: string): ExchangeSymbol | undefined {
    return this.symbolsMap.get(name);
  }

  getSymbols(): readonly ExchangeSymbol[] {
    return this.symbolsCollectionCache;
  }

  getSymbolsMap(): ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol> {
    return this.symbolsMap;
  }

  setSymbols(exchangeSymbols: readonly ExchangeSymbol[]): void {
    this.symbolsCollectionCache = exchangeSymbols;
    this.symbolsMap = this.mapSymbolsCollectionToMap(exchangeSymbols);
  }

  protected mapSymbolsCollectionToMap(symbolsCollection: readonly ExchangeSymbol[]): Map<ExchangeSymbol['name'], ExchangeSymbol> {
    const symbolsMap: Map<ExchangeSymbol['name'], ExchangeSymbol> = new Map();

    for (const symbol of symbolsCollection)
      symbolsMap.set(symbol.name, symbol);

    return symbolsMap;
  }
}
