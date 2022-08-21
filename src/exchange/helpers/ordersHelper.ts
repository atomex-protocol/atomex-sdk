import type { ExchangeSymbolsProvider } from '../exchangeSymbolsProvider';
import type { OrderPreviewParameters, NormalizedOrderPreviewParameters, NewOrderRequest, OrderPreview } from '../models';
import { convertFromAndToCurrenciesToSymbolAndSide, convertSymbolAndSideToFromAndToCurrencies } from './symbolsHelper';

export const isOrderPreview = (orderBody: NewOrderRequest['orderBody']): orderBody is OrderPreview => {
  return typeof orderBody.symbol === 'string' && typeof orderBody.side === 'string'
    && !!(orderBody as OrderPreview).from && !!(orderBody as OrderPreview).to;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNormalizedOrderPreviewParameters = (orderPreviewParameters: any): orderPreviewParameters is NormalizedOrderPreviewParameters => {
  return !!(orderPreviewParameters.symbol && orderPreviewParameters.side && orderPreviewParameters.from && orderPreviewParameters.to
    && typeof orderPreviewParameters.isQuoteCurrencyAmount === 'boolean'
    && typeof orderPreviewParameters.isFromAmount === 'boolean'
  );
};

export const normalizeOrderPreviewParameters = (
  orderPreviewParameters: OrderPreviewParameters,
  exchangeSymbolsProvider: ExchangeSymbolsProvider
): NormalizedOrderPreviewParameters => {
  const exchangeSymbols = exchangeSymbolsProvider.getSymbolsMap();

  let symbol: string;
  let exchangeSymbol: NormalizedOrderPreviewParameters['exchangeSymbol'] | undefined;
  let side: NormalizedOrderPreviewParameters['side'];
  let isQuoteCurrencyAmount: NormalizedOrderPreviewParameters['isQuoteCurrencyAmount'] = true;
  let from: NormalizedOrderPreviewParameters['from'];
  let to: NormalizedOrderPreviewParameters['to'];
  let isFromAmount: NormalizedOrderPreviewParameters['isFromAmount'] = true;

  if (orderPreviewParameters.symbol && orderPreviewParameters.side) {
    symbol = orderPreviewParameters.symbol;
    exchangeSymbol = exchangeSymbols.get(symbol);
    if (!exchangeSymbol)
      throw new Error(`The ${symbol} Symbol not found`);

    side = orderPreviewParameters.side;
    if (orderPreviewParameters.isQuoteCurrencyAmount !== undefined && orderPreviewParameters.isQuoteCurrencyAmount !== null)
      isQuoteCurrencyAmount = orderPreviewParameters.isQuoteCurrencyAmount;

    [from, to] = convertSymbolAndSideToFromAndToCurrencies(exchangeSymbol, side);
    isFromAmount = (isQuoteCurrencyAmount && from === exchangeSymbol.quoteCurrency)
      || (!isQuoteCurrencyAmount && to === exchangeSymbol.quoteCurrency);
  }
  else if (orderPreviewParameters.from && orderPreviewParameters.to) {
    from = orderPreviewParameters.from;
    to = orderPreviewParameters.to;
    isFromAmount = (orderPreviewParameters.isFromAmount !== undefined && orderPreviewParameters.isFromAmount !== null)
      ? orderPreviewParameters.isFromAmount
      : true;

    [exchangeSymbol, side] = convertFromAndToCurrenciesToSymbolAndSide(exchangeSymbols, orderPreviewParameters.from, orderPreviewParameters.to);
    symbol = exchangeSymbol.name;
    isQuoteCurrencyAmount = (isFromAmount && orderPreviewParameters.from === exchangeSymbol.quoteCurrency)
      || (!isFromAmount && orderPreviewParameters.to === exchangeSymbol.quoteCurrency);
  }
  else
    throw new Error('Invalid orderPreviewParameters argument passed');

  return {
    type: orderPreviewParameters.type,
    amount: orderPreviewParameters.amount,
    exchangeSymbol,
    side,
    isQuoteCurrencyAmount,
    from,
    to,
    isFromAmount
  };
};
