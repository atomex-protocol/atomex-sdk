import BigNumber from 'bignumber.js';

import type { Transaction } from '../blockchain/models/index';
import type { Currency, Side } from '../common/index';
import type { ExchangeSymbol, Order, OrderBook, OrderCurrency, Quote } from '../exchange/index';
import type { Swap, SwapParticipantTrade } from '../swaps/index';
import type { OrderBookDto, OrderDto, QuoteDto, SwapDto, SymbolDto, TradeDto, TransactionDto, WebSocketOrderBookEntryDto, WebSocketOrderDataDto } from './dtos';

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
  let symbol = symbols.find(symbol => symbol.name === `${from}/${to}`);
  let side: Side = 'Sell';

  if (!symbol) {
    symbol = symbols.find(symbol => symbol.name === `${to}/${from}`);
    side = 'Buy';
  }

  if (!symbol)
    throw new Error(`Invalid pair: ${from}/${to}`);

  return [symbol.name, side];
};

export const mapQuoteDtosToQuotes = (quoteDtos: QuoteDto[]): Quote[] => {
  const quotes: Quote[] = quoteDtos.map(quoteDto => mapQuoteDtoToQuote(quoteDto));

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
  const symbols: ExchangeSymbol[] = symbolDtos.map(symbolDto => {
    const [quoteCurrency, baseCurrency] = getQuoteBaseCurrenciesBySymbol(symbolDto.name);

    return {
      name: symbolDto.name,
      minimumQty: new BigNumber(symbolDto.minimumQty),
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
    entries: orderBookDto.entries.map(orderBookEntryDto => ({
      side: orderBookEntryDto.side,
      price: new BigNumber(orderBookEntryDto.price),
      qtyProfile: orderBookEntryDto.qtyProfile
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
    entries: orderBookEntryDtos.map(orderBookEntryDto => ({
      side: orderBookEntryDto.side,
      price: new BigNumber(orderBookEntryDto.price),
      qtyProfile: orderBookEntryDto.qtyProfile
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
    swapIds: orderDto.swaps?.map(swap => swap.id) || [],
  };
};

export const mapOrderDtosToOrders = (orderDtos: OrderDto[]): Order[] => {
  const orders = orderDtos.map(orderDto => mapOrderDtoToOrder(orderDto));

  return orders;
};

export const mapTransactionDtosToTransactions = (transactionDtos: TransactionDto[]): Transaction[] => {
  const transactions = transactionDtos.map(transactionDto => ({
    id: transactionDto.txId,
    blockId: transactionDto.blockHeight,
    confirmations: transactionDto.confirmations,
    currencyId: transactionDto.currency,
    status: transactionDto.status,
    type: transactionDto.type
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
      trades: mapTradeDtosToTrades(swapDto.counterParty.trades)
    },
    user: {
      status: swapDto.user.status,
      transactions: mapTransactionDtosToTransactions(swapDto.user.transactions),
      requisites: {
        ...swapDto.user.requisites,
        rewardForRedeem: new BigNumber(swapDto.user.requisites.rewardForRedeem),
      },
      trades: mapTradeDtosToTrades(swapDto.user.trades)
    },
  };

  return swap;
};

export const mapTradeDtosToTrades = (tradeDtos: TradeDto[]): SwapParticipantTrade[] => {
  const trades = tradeDtos.map(tradeDto => ({
    orderId: tradeDto.orderId,
    price: new BigNumber(tradeDto.price),
    qty: new BigNumber(tradeDto.qty),
  }));

  return trades;
};

export const mapSwapDtosToSwaps = (swapDtos: SwapDto[]): Swap[] => {
  const swaps = swapDtos.map(swapDto => mapSwapDtoToSwap(swapDto));

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
