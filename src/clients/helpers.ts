import BigNumber from 'bignumber.js';

import type { Transaction } from '../blockchain/models/index';
import type { CurrenciesProvider } from '../common/index';
import { ExchangeSymbol, ExchangeSymbolsProvider, Order, OrderBook, OrderBookEntry, OrderBookProvider, Quote, symbolsHelper } from '../exchange/index';
import type { Swap, SwapParticipantTrade } from '../swaps/index';
import type {
  OrderBookDto, OrderBookEntryDto, OrderDto, QuoteDto, SwapDto, SymbolDto,
  TradeDto, TransactionDto, WebSocketOrderBookEntryDto, WebSocketOrderDataDto
} from './dtos';

export const mapQuoteDtosToQuotes = (quoteDtos: QuoteDto[]): Quote[] => {
  const quotes: Quote[] = quoteDtos.map(quoteDto => mapQuoteDtoToQuote(quoteDto));

  return quotes;
};

export const mapQuoteDtoToQuote = (quoteDto: QuoteDto): Quote => {
  const [baseCurrency, quoteCurrency] = symbolsHelper.getBaseQuoteCurrenciesBySymbol(quoteDto.symbol);

  const quote: Quote = {
    ask: new BigNumber(quoteDto.ask),
    bid: new BigNumber(quoteDto.bid),
    symbol: quoteDto.symbol,
    timeStamp: new Date(quoteDto.timeStamp),
    baseCurrency,
    quoteCurrency
  };

  return quote;
};

export const mapSymbolDtoToSymbol = (symbolDto: SymbolDto, currenciesProvider: CurrenciesProvider, defaultDecimals = 9): ExchangeSymbol => {
  const [baseCurrency, quoteCurrency] = symbolsHelper.getBaseQuoteCurrenciesBySymbol(symbolDto.name);
  const baseCurrencyDecimals = currenciesProvider.getCurrency(baseCurrency)?.decimals;
  const quoteCurrencyDecimals = currenciesProvider.getCurrency(quoteCurrency)?.decimals;

  const preparedBaseCurrencyDecimals = baseCurrencyDecimals ? Math.min(baseCurrencyDecimals, defaultDecimals) : defaultDecimals;
  const preparedQuoteCurrencyDecimals = quoteCurrencyDecimals ? Math.min(quoteCurrencyDecimals, defaultDecimals) : defaultDecimals;

  return {
    name: symbolDto.name,
    baseCurrency,
    quoteCurrency,
    minimumQty: new BigNumber(symbolDto.minimumQty),
    decimals: {
      baseCurrency: preparedBaseCurrencyDecimals,
      quoteCurrency: preparedQuoteCurrencyDecimals,
      price: defaultDecimals
    }
  };
};

export const mapSymbolDtosToSymbols = (
  symbolDtos: readonly SymbolDto[],
  currenciesProvider: CurrenciesProvider,
  defaultDecimals?: number
): ExchangeSymbol[] => {
  return symbolDtos.map(symbolDto => mapSymbolDtoToSymbol(symbolDto, currenciesProvider, defaultDecimals));
};

export const mapOrderBookDtoToOrderBook = (orderBookDto: OrderBookDto): OrderBook => {
  const [baseCurrency, quoteCurrency] = symbolsHelper.getBaseQuoteCurrenciesBySymbol(orderBookDto.symbol);

  const orderBook: OrderBook = {
    updateId: orderBookDto.updateId,
    symbol: orderBookDto.symbol,
    baseCurrency,
    quoteCurrency,
    entries: orderBookDto.entries.map(orderBookEntryDto => mapOrderBookEntryDtoToOrderBookEntry(orderBookEntryDto))
  };

  return orderBook;
};

export const mapOrderBookEntryDtoToOrderBookEntry = (entryDto: OrderBookEntryDto): OrderBookEntry => {
  const entry: OrderBookEntry = {
    side: entryDto.side,
    price: new BigNumber(entryDto.price),
    qtyProfile: entryDto.qtyProfile
  };

  return entry;
};

export const mapWebSocketOrderBookEntryDtoToOrderBooks = (
  orderBookEntryDtos: WebSocketOrderBookEntryDto[],
  orderBookProvider: OrderBookProvider
): OrderBook[] => {
  const updatedOrderBooks: Map<OrderBook['symbol'], OrderBook> = new Map();

  for (const entryDto of orderBookEntryDtos) {
    const orderBook = updatedOrderBooks.get(entryDto.symbol) || orderBookProvider.getOrderBook(entryDto.symbol);
    if (!orderBook)
      continue;

    const entry = mapOrderBookEntryDtoToOrderBookEntry(entryDto);
    const storedEntry = orderBook.entries.find(e => e.side === entry.side && e.price.isEqualTo(entry.price));

    const updatedEntries = entryDto.qtyProfile.length
      ? storedEntry
        ? orderBook.entries.map(e => e === storedEntry ? { ...e, qtyProfile: entry.qtyProfile } : e)
        : [...orderBook.entries, entry]
      : orderBook.entries.filter(e => e !== storedEntry);

    const updatedOrderBook: OrderBook = {
      ...orderBook,
      updateId: entryDto.updateId,
      entries: updatedEntries
    };

    updatedOrderBooks.set(updatedOrderBook.symbol, updatedOrderBook);
  }

  return Array.from(updatedOrderBooks.values());
};

export const mapOrderDtoToOrder = (orderDto: OrderDto, exchangeSymbolsProvider: ExchangeSymbolsProvider): Order => {
  const exchangeSymbol = exchangeSymbolsProvider.getSymbol(orderDto.symbol);
  if (!exchangeSymbol)
    throw new Error(`"${orderDto.symbol}" symbol not found`);

  const [from, to] = symbolsHelper.convertSymbolAndSideToFromAndToSymbolCurrencies(exchangeSymbol, orderDto.side, orderDto.qty, orderDto.price);

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

export const mapOrderDtosToOrders = (orderDtos: OrderDto[], exchangeSymbolsProvider: ExchangeSymbolsProvider): Order[] => {
  return orderDtos.map(orderDto => mapOrderDtoToOrder(orderDto, exchangeSymbolsProvider));
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

export const mapSwapDtoToSwap = (swapDto: SwapDto, exchangeSymbolsProvider: ExchangeSymbolsProvider): Swap => {
  const exchangeSymbol = exchangeSymbolsProvider.getSymbol(swapDto.symbol);
  if (!exchangeSymbol)
    throw new Error(`"${swapDto.symbol}" symbol not found`);

  const [from, to] = symbolsHelper.convertSymbolAndSideToFromAndToSymbolCurrencies(exchangeSymbol, swapDto.side, swapDto.qty, swapDto.price);

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

export const mapSwapDtosToSwaps = (swapDtos: SwapDto[], exchangeSymbolsProvider: ExchangeSymbolsProvider): Swap[] => {
  return swapDtos.map(swapDto => mapSwapDtoToSwap(swapDto, exchangeSymbolsProvider));
};

export const mapWebSocketOrderDtoToOrder = (orderDto: WebSocketOrderDataDto, exchangeSymbolsProvider: ExchangeSymbolsProvider): Order => {
  const exchangeSymbol = exchangeSymbolsProvider.getSymbol(orderDto.symbol);
  if (!exchangeSymbol)
    throw new Error(`"${orderDto.symbol}" symbol not found`);

  const [from, to] = symbolsHelper.convertSymbolAndSideToFromAndToSymbolCurrencies(exchangeSymbol, orderDto.side, orderDto.qty, orderDto.price);

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
