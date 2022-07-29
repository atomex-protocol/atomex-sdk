import BigNumber from 'bignumber.js';

import type { Transaction } from '../blockchain/models/index';
import type { Currency, Side } from '../common/index';
import type { ExchangeSymbol, Order, OrderBook, OrderCurrency, Quote } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { OrderBookDto, OrderDto, QuoteDto, SwapDto, SymbolDto, TransactionDto, WebSocketOrderBookEntryDto, WebSocketOrderDataDto } from './dtos';

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

export const findSymbolAndSide = (symbols: ExchangeSymbol[], from: Currency['id'], to: Currency['id']): [symbol: string, side: Side] => {
  let symbol = symbols.find(s => s.name === `${from}/${to}`);
  let side: Side = 'Sell';

  if (!symbol) {
    symbol = symbols.find(s => s.name === `${to}/${from}`);
    side = 'Buy';
  }

  if (!symbol)
    throw new Error(`Invalid pair: ${from}/${to}`);

  return [symbol.name, side];
};

export const mapQuoteDtosToQuotes = (quoteDtos: QuoteDto[]): Quote[] => {
  const quotes: Quote[] = quoteDtos.map(dto => mapQuoteDtoToQuote(dto));

  return quotes;
};

export const mapQuoteDtoToQuote = (quoteDto: QuoteDto): Quote => {
  const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(quoteDto.symbol);

  const quote: Quote = {
    ask: new BigNumber(quoteDto.ask),
    bid: new BigNumber(quoteDto.bid),
    symbol: quoteDto.symbol,
    timeStamp: new Date(quoteDto.timeStamp),
    quoteCurrency,
    baseCurrency
  };

  return quote;
};

export const mapSymbolDtosToSymbols = (symbolDtos: SymbolDto[]): ExchangeSymbol[] => {
  const symbols: ExchangeSymbol[] = symbolDtos.map(dto => {
    const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(dto.name);

    return {
      name: dto.name,
      minimumQty: new BigNumber(dto.minimumQty),
      quoteCurrency,
      baseCurrency
    };
  });

  return symbols;
};

export const mapOrderBookDtoToOrderBook = (orderBookDto: OrderBookDto): OrderBook => {
  const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(orderBookDto.symbol);

  const orderBook: OrderBook = {
    updateId: orderBookDto.updateId,
    symbol: orderBookDto.symbol,
    quoteCurrency,
    baseCurrency,
    entries: orderBookDto.entries.map(e => ({
      side: e.side,
      price: new BigNumber(e.price),
      qtyProfile: e.qtyProfile
    }))
  };

  return orderBook;
};


export const mapWebSocketOrderBookEntryDtoToOrderBook = (orderBookEntryDtos: WebSocketOrderBookEntryDto[]): OrderBook => {
  const firstOrderBookEntry = orderBookEntryDtos[0];
  if (!firstOrderBookEntry)
    throw new Error('Unexpected dto');

  const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(firstOrderBookEntry.symbol);

  const orderBook: OrderBook = {
    updateId: firstOrderBookEntry.updateId,
    symbol: firstOrderBookEntry.symbol,
    quoteCurrency,
    baseCurrency,
    entries: orderBookEntryDtos.map(e => ({
      side: e.side,
      price: new BigNumber(e.price),
      qtyProfile: e.qtyProfile
    }))
  };

  return orderBook;
};

export const mapOrderDtoToOrder = (orderDto: OrderDto): Order => {
  const [from, to] = getFromToCurrencies(orderDto.symbol, orderDto.qty, orderDto.price, orderDto.side);

  return {
    id: orderDto.id,
    from,
    to,
    clientOrderId: orderDto.clientOrderId,
    side: orderDto.side,
    symbol: orderDto.symbol,
    leaveQty: new BigNumber(orderDto.leaveQty),
    timeStamp: new Date(orderDto.timeStamp),
    type: orderDto.type,
    status: orderDto.status,
    swapIds: orderDto.swaps?.map(s => s.id) || [],
  };
};

export const mapOrderDtosToOrders = (orderDtos: OrderDto[]): Order[] => {
  const orders = orderDtos.map(dto => mapOrderDtoToOrder(dto));

  return orders;
};

export const mapTransactionDtosToTransactions = (transactionDtos: TransactionDto[]): Transaction[] => {
  const transactions = transactionDtos.map(t => ({
    id: t.txId,
    blockId: t.blockHeight,
    confirmations: t.confirmations,
    currencyId: t.currency,
    status: t.status,
    type: t.type
  }));

  return transactions;
};

export const mapSwapDtoToSwap = (swapDto: SwapDto): Swap => {
  const [from, to] = getFromToCurrencies(swapDto.symbol, swapDto.qty, swapDto.price, swapDto.side);

  const swap: Swap = {
    isInitiator: swapDto.isInitiator,
    secret: swapDto.secret,
    secretHash: swapDto.secretHash,
    id: Number(swapDto.id),
    from,
    to,
    trade: {
      qty: new BigNumber(swapDto.qty),
      price: new BigNumber(swapDto.price),
      side: swapDto.side,
      symbol: swapDto.symbol
    },
    timeStamp: new Date(swapDto.timeStamp),
    counterParty: {
      status: swapDto.counterParty.status,
      transactions: mapTransactionDtosToTransactions(swapDto.counterParty.transactions),
      requisites: {
        ...swapDto.counterParty.requisites,
        rewardForRedeem: new BigNumber(swapDto.counterParty.requisites.rewardForRedeem),
      },
      trades: swapDto.counterParty.trades.map(t => ({
        orderId: t.orderId,
        price: new BigNumber(t.price),
        qty: new BigNumber(t.qty),
      })),
    },
    user: {
      status: swapDto.user.status,
      transactions: mapTransactionDtosToTransactions(swapDto.user.transactions),
      requisites: {
        ...swapDto.user.requisites,
        rewardForRedeem: new BigNumber(swapDto.user.requisites.rewardForRedeem),
      },
      trades: swapDto.user.trades.map(t => ({
        orderId: t.orderId,
        price: new BigNumber(t.price),
        qty: new BigNumber(t.qty),
      })),
    },
  };

  return swap;
};

export const mapSwapDtosToSwaps = (swapDtos: SwapDto[]): Swap[] => {
  const swaps = swapDtos.map(dto => mapSwapDtoToSwap(dto));

  return swaps;
};

export const mapWebSocketOrderDtoToOrder = (orderDto: WebSocketOrderDataDto): Order => {
  const [from, to] = getFromToCurrencies(orderDto.symbol, orderDto.qty, orderDto.price, orderDto.side);

  const order: Order = {
    id: orderDto.id,
    clientOrderId: orderDto.clientOrderId,
    side: orderDto.side,
    status: orderDto.status,
    leaveQty: new BigNumber(orderDto.leaveQty),
    swapIds: orderDto.swaps,
    symbol: orderDto.symbol,
    type: orderDto.type,
    timeStamp: new Date(orderDto.timeStamp),
    from,
    to
  };

  return order;
};
