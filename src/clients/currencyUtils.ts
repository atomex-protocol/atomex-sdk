import BigNumber from 'bignumber.js';

import { OrderCurrency } from '../exchange/index';
import { Side } from '../index';

export const getQuoteBaseCurrenciesBySymbol = (symbol: string): [quoteCurrency: string, baseCurrency: string] => {
  const [quoteCurrency = '', baseCurrency = ''] = symbol.split('/');

  return [quoteCurrency, baseCurrency];
};

export const getFromToCurrencies = (symbol: string, qty: number, price: number, side: Side): [from: OrderCurrency, to: OrderCurrency] => {
  const [quoteCurrencyId, baseCurrencyId] = getQuoteBaseCurrenciesBySymbol(symbol);

  const quoteCurrencyAmount = new BigNumber(qty);
  const quoteCurrencyPrice = new BigNumber(price);
  const baseCurrencyAmount = quoteCurrencyPrice.multipliedBy(quoteCurrencyAmount);
  const baseCurrencyPrice = quoteCurrencyAmount.div(baseCurrencyAmount);

  const quoteCurrency: OrderCurrency = {
    currencyId: quoteCurrencyId,
    amount: quoteCurrencyAmount,
    price: quoteCurrencyPrice,
  };

  const baseCurrency: OrderCurrency = {
    currencyId: baseCurrencyId,
    amount: baseCurrencyAmount,
    price: baseCurrencyPrice,
  };

  return side === 'Buy'
    ? [baseCurrency, quoteCurrency]
    : [quoteCurrency, baseCurrency];
};

