import type { ExchangeSymbol } from '../models/index';
export interface ExchangeSymbolsProvider {
    getSymbol(name: string): ExchangeSymbol | undefined;
    getSymbols(): readonly ExchangeSymbol[];
    getSymbolsMap(): ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol>;
}
export interface ManagedExchangeSymbolsProvider extends ExchangeSymbolsProvider {
    setSymbols(exchangeSymbols: readonly ExchangeSymbol[]): void;
}
