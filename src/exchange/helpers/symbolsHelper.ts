import BigNumber from 'bignumber.js';

import type { Currency, Side } from '../../common/index';
import { converters, guards } from '../../utils/index';
import type { ExchangeSymbol, SymbolCurrency } from '../models/index';

export const getBaseQuoteCurrenciesBySymbol = (symbol: string): readonly [baseCurrency: string, quoteCurrency: string] => {
  const result = symbol.split('/', 2);

  return [result[0] || '', result[1] || ''];
};

export const convertSymbolAndSideToFromAndToSymbolCurrencies = (
  symbol: ExchangeSymbol,
  side: Side,
  currencyAmount: BigNumber.Value,
  baseCurrencyPrice: BigNumber.Value,
  isBaseCurrencyAmount = true
): readonly [from: SymbolCurrency, to: SymbolCurrency] => {
  const preparedBaseCurrencyPrice = converters.toFixedBigNumber(baseCurrencyPrice, symbol.decimals.price, BigNumber.ROUND_FLOOR);
  const [baseCurrencyId, quoteCurrencyId] = getBaseQuoteCurrenciesBySymbol(symbol.name);
  const isBuySide = side === 'Buy';

  let preparedBaseCurrencyAmount: BigNumber;
  let preparedQuoteCurrencyAmount: BigNumber;

  if (isBaseCurrencyAmount) {
    preparedBaseCurrencyAmount = converters.toFixedBigNumber(currencyAmount, symbol.decimals.baseCurrency, BigNumber.ROUND_FLOOR);
    preparedQuoteCurrencyAmount = converters.toFixedBigNumber(
      preparedBaseCurrencyPrice.multipliedBy(preparedBaseCurrencyAmount),
      symbol.decimals.quoteCurrency,
      isBuySide ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR
    );
  }
  else {
    preparedQuoteCurrencyAmount = converters.toFixedBigNumber(currencyAmount, symbol.decimals.quoteCurrency, BigNumber.ROUND_FLOOR);
    preparedBaseCurrencyAmount = converters.toFixedBigNumber(
      preparedQuoteCurrencyAmount.div(preparedBaseCurrencyPrice),
      symbol.decimals.baseCurrency,
      isBuySide ? BigNumber.ROUND_FLOOR : BigNumber.ROUND_CEIL
    );
  }

  const preparedQuoteCurrencyPrice = converters.toFixedBigNumber(
    new BigNumber(1).div(preparedBaseCurrencyPrice),
    symbol.decimals.price,
    BigNumber.ROUND_FLOOR
  );

  const baseCurrency: SymbolCurrency = {
    currencyId: baseCurrencyId,
    amount: preparedBaseCurrencyAmount,
    price: preparedBaseCurrencyPrice,
  };

  const quoteCurrency: SymbolCurrency = {
    currencyId: quoteCurrencyId,
    amount: preparedQuoteCurrencyAmount,
    price: preparedQuoteCurrencyPrice,
  };

  return isBuySide
    ? [quoteCurrency, baseCurrency]
    : [baseCurrency, quoteCurrency];
};

export const convertSymbolAndSideToFromAndToCurrencies = (
  symbol: ExchangeSymbol | string,
  side: Side
): readonly [from: Currency['id'], to: Currency['id']] => {
  let baseCurrency: Currency['id'];
  let quoteCurrency: Currency['id'];

  if (typeof symbol === 'string') {
    const baseAndQuoteCurrencies = getBaseQuoteCurrenciesBySymbol(symbol);
    baseCurrency = baseAndQuoteCurrencies[0];
    quoteCurrency = baseAndQuoteCurrencies[1];
  } else {
    baseCurrency = symbol.baseCurrency;
    quoteCurrency = symbol.quoteCurrency;
  }

  return side === 'Sell'
    ? [quoteCurrency, baseCurrency]
    : [baseCurrency, quoteCurrency];
};

export const convertFromAndToCurrenciesToSymbolAndSide = (
  symbols: ReadonlyMap<ExchangeSymbol['name'], ExchangeSymbol> | readonly ExchangeSymbol[],
  from: Currency['id'],
  to: Currency['id']
): readonly [exchangeSymbol: ExchangeSymbol, side: Side] => {
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

  return [symbol, side];
};
