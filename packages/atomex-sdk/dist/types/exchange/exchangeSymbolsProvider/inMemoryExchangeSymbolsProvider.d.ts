import type { ExchangeSymbol } from '../models/exchangeSymbol';
import type { ManagedExchangeSymbolsProvider } from './exchangeSymbolsProvider';
export declare class InMemoryExchangeSymbolsProvider implements ManagedExchangeSymbolsProvider {
    private symbolsMap;
    private symbolsCollectionCache;
    getSymbol(name: string): ExchangeSymbol | undefined;
    getSymbols(): readonly ExchangeSymbol[];
    getSymbolsMap(): ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol>;
    setSymbols(exchangeSymbols: readonly ExchangeSymbol[]): void;
    protected mapSymbolsCollectionToMap(symbolsCollection: readonly ExchangeSymbol[]): Map<ExchangeSymbol['name'], ExchangeSymbol>;
}
