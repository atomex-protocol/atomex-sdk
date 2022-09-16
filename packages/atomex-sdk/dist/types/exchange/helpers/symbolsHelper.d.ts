import BigNumber from 'bignumber.js';
import type { Currency, Side } from '../../common/index';
import type { ExchangeSymbol, SymbolCurrency } from '../models/index';
export declare const getBaseQuoteCurrenciesBySymbol: (symbol: string) => readonly [baseCurrency: string, quoteCurrency: string];
export declare const convertSymbolAndSideToFromAndToSymbolCurrencies: (symbol: ExchangeSymbol, side: Side, currencyAmount: BigNumber.Value, baseCurrencyPrice: BigNumber.Value, isBaseCurrencyAmount?: boolean) => readonly [from: SymbolCurrency, to: SymbolCurrency];
export declare const convertSymbolAndSideToFromAndToCurrencies: (symbol: ExchangeSymbol | string, side: Side) => readonly [from: Currency['id'], to: Currency['id']];
export declare const convertFromAndToCurrenciesToSymbolAndSide: (symbols: ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol> | readonly ExchangeSymbol[], from: Currency['id'], to: Currency['id']) => readonly [exchangeSymbol: ExchangeSymbol, side: Side];