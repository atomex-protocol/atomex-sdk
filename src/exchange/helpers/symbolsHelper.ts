import BigNumber from 'bignumber.js';

import type { Currency, Side } from '../../common/index';
import { guards } from '../../utils/index';
import type { ExchangeSymbol, SymbolCurrency } from '../models/index';

export const getQuoteBaseCurrenciesBySymbol = (symbol: string): readonly [quoteCurrency: string, baseCurrency: string] => {
  const [quoteCurrency = '', baseCurrency = ''] = symbol.split('/');

  return [quoteCurrency, baseCurrency];
};

export const convertSymbolToFromToCurrenciesPair = (
  symbol: ExchangeSymbol,
  side: Side,
  quoteCurrencyAmount: BigNumber | number | string,
  quoteCurrencyPrice: BigNumber | number | string
): readonly [from: SymbolCurrency, to: SymbolCurrency] => {
  quoteCurrencyAmount = new BigNumber(quoteCurrencyAmount);
  quoteCurrencyPrice = new BigNumber(quoteCurrencyPrice);

  const [quoteCurrencyId, baseCurrencyId] = getQuoteBaseCurrenciesBySymbol(symbol.name);
  const baseCurrencyAmount = quoteCurrencyPrice.multipliedBy(quoteCurrencyAmount);
  const baseCurrencyPrice = quoteCurrencyAmount.div(baseCurrencyAmount);

  const quoteCurrency: SymbolCurrency = {
    currencyId: quoteCurrencyId,
    amount: quoteCurrencyAmount,
    price: quoteCurrencyPrice,
  };

  const baseCurrency: SymbolCurrency = {
    currencyId: baseCurrencyId,
    amount: baseCurrencyAmount,
    price: baseCurrencyPrice,
  };

  return side === 'Buy'
    ? [baseCurrency, quoteCurrency]
    : [quoteCurrency, baseCurrency];
};

export const findSymbolAndSide = (
  symbols: ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol> | readonly ExchangeSymbol[],
  from: Currency['id'],
  to: Currency['id']
): readonly [symbol: string, side: Side] => {
  const sellSideSymbolName = `${from}/${to}`;
  const buySideSymbolName = `${to}/${from}`;
  let symbol: ExchangeSymbol | undefined;
  let side: Side = 'Sell';

  if (guards.isReadonlyArray(symbols)) {
    for (const s of symbols) {
      if (s.name === sellSideSymbolName) {
        symbol = s;
        break;
      }

      if (s.name === buySideSymbolName) {
        symbol = s;
        side = 'Buy';
        break;
      }
    }
  }
  else {
    symbol = symbols.get(sellSideSymbolName);
    if (!symbol) {
      side = 'Buy';
      symbol = symbols.get(buySideSymbolName);
    }
  }

  if (!symbol)
    throw new Error(`Invalid pair: ${from}/${to}`);

  return [symbol.name, side];
};
