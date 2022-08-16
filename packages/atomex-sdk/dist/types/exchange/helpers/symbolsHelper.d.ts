import BigNumber from 'bignumber.js';
import type { Currency, Side } from '../../common/index';
import type { ExchangeSymbol, SymbolCurrency } from '../models/index';
export declare const getQuoteBaseCurrenciesBySymbol: (symbol: string) => readonly [quoteCurrency: string, baseCurrency: string];
export declare const convertSymbolToFromToCurrenciesPair: (symbol: ExchangeSymbol, side: Side, currencyAmount: BigNumber.Value, quoteCurrencyPrice: BigNumber.Value, isQuoteCurrencyAmount?: boolean) => readonly [from: SymbolCurrency, to: SymbolCurrency];
export declare const findExchangeSymbolAndSide: (symbols: ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol> | readonly ExchangeSymbol[], from: Currency['id'], to: Currency['id']) => readonly [exchangeSymbol: ExchangeSymbol, side: Side];
