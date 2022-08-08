import BigNumber from 'bignumber.js';

import type { Currency, Side } from '../../common/index';
import { converters, guards } from '../../utils/index';
import type { ExchangeSymbol, SymbolCurrency } from '../models/index';

export const getQuoteBaseCurrenciesBySymbol = (symbol: string): readonly [quoteCurrency: string, baseCurrency: string] => {
  const [quoteCurrency = '', baseCurrency = ''] = symbol.split('/');

  return [quoteCurrency, baseCurrency];
};

export const convertSymbolToFromToCurrenciesPair = (
  symbol: ExchangeSymbol,
  side: Side,
  quoteCurrencyAmount: BigNumber.Value,
  quoteCurrencyPrice: BigNumber.Value
): readonly [from: SymbolCurrency, to: SymbolCurrency] => {
  const preparedQuoteCurrencyAmount = converters.toFixedBigNumber(quoteCurrencyAmount, symbol.decimals.quoteCurrency, BigNumber.ROUND_FLOOR);
  const preparedQuoteCurrencyPrice = converters.toFixedBigNumber(quoteCurrencyPrice, symbol.decimals.price, BigNumber.ROUND_FLOOR);

  const [quoteCurrencyId, baseCurrencyId] = getQuoteBaseCurrenciesBySymbol(symbol.name);
  const preparedBaseCurrencyAmount = converters.toFixedBigNumber(
    preparedQuoteCurrencyPrice.multipliedBy(preparedQuoteCurrencyAmount),
    symbol.decimals.baseCurrency,
    BigNumber.ROUND_FLOOR
  );
  const preparedBaseCurrencyPrice = converters.toFixedBigNumber(
    preparedQuoteCurrencyAmount.div(preparedBaseCurrencyAmount),
    symbol.decimals.price,
    BigNumber.ROUND_FLOOR
  );

  const quoteCurrency: SymbolCurrency = {
    currencyId: quoteCurrencyId,
    amount: preparedQuoteCurrencyAmount,
    price: preparedQuoteCurrencyPrice,
  };

  const baseCurrency: SymbolCurrency = {
    currencyId: baseCurrencyId,
    amount: preparedBaseCurrencyAmount,
    price: preparedBaseCurrencyPrice,
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
