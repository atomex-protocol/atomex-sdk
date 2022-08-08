import BigNumber from 'bignumber.js';
import type { Currency, Side } from '../../common/index';
import type { ExchangeSymbol, SymbolCurrency } from '../models/index';
export declare const getQuoteBaseCurrenciesBySymbol: (symbol: string) => readonly [quoteCurrency: string, baseCurrency: string];
export declare const convertSymbolToFromToCurrenciesPair: (symbol: ExchangeSymbol, side: Side, quoteCurrencyAmount: BigNumber.Value, quoteCurrencyPrice: BigNumber.Value) => readonly [from: SymbolCurrency, to: SymbolCurrency];
export declare const findSymbolAndSide: (symbols: ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol> | readonly ExchangeSymbol[], from: Currency['id'], to: Currency['id']) => readonly [symbol: string, side: Side];
