import type { AuthorizationManager } from '../../authorization/index';
import type { Transaction } from '../../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../../common/index';
import { DeferredEventEmitter, EventEmitter, ToDeferredEventEmitter, type ToEventEmitter } from '../../core';
import type {
  Order, OrderBook, Quote, ExchangeSymbol, FilledNewOrderRequest,
  OrdersSelector, CancelOrderRequest,
  CancelAllOrdersRequest, SwapsSelector, CurrencyDirection, ExchangeSymbolsProvider, ManagedOrderBookProvider
} from '../../exchange/index';
import type { Swap } from '../../swaps/index';
import type { AtomexClient } from '../atomexClient';
import type { OrderBookDto, WebSocketOrderBookEntryDto, WebSocketResponseDto } from '../dtos';
import { mapOrderBookDtoToOrderBook, mapQuoteDtosToQuotes, mapSwapDtoToSwap, mapWebSocketOrderBookEntryDtoToOrderBooks, mapWebSocketOrderDtoToOrder } from '../helpers';
import { ExchangeWebSocketClient } from './exchangeWebSocketClient';
import { MarketDataWebSocketClient } from './marketDataWebSocketClient';

export interface WebSocketAtomexClientOptions {
  atomexNetwork: AtomexNetwork;
  authorizationManager: AuthorizationManager;
  currenciesProvider: CurrenciesProvider;
  exchangeSymbolsProvider: ExchangeSymbolsProvider;
  orderBookProvider: ManagedOrderBookProvider;
  webSocketApiBaseUrl: string;
}

export class WebSocketAtomexClient implements AtomexClient {
  readonly atomexNetwork: AtomexNetwork;
  readonly events: AtomexClient['events'] = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookSnapshot: new EventEmitter(),
    orderBookUpdated: new DeferredEventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  protected readonly authorizationManager: AuthorizationManager;
  protected readonly exchangeSymbolsProvider: ExchangeSymbolsProvider;
  protected readonly currenciesProvider: CurrenciesProvider;
  protected readonly webSocketApiBaseUrl: string;
  protected readonly marketDataWebSocketClient: MarketDataWebSocketClient;
  protected readonly exchangeWebSocketClient: ExchangeWebSocketClient;
  protected readonly orderBookProvider: ManagedOrderBookProvider;

  private _isStarted = false;

  constructor(options: WebSocketAtomexClientOptions) {
    this.atomexNetwork = options.atomexNetwork;
    this.authorizationManager = options.authorizationManager;
    this.currenciesProvider = options.currenciesProvider;
    this.exchangeSymbolsProvider = options.exchangeSymbolsProvider;
    this.orderBookProvider = options.orderBookProvider;
    this.webSocketApiBaseUrl = options.webSocketApiBaseUrl;

    this.exchangeWebSocketClient = new ExchangeWebSocketClient(this.webSocketApiBaseUrl, this.authorizationManager);
    this.marketDataWebSocketClient = new MarketDataWebSocketClient(this.webSocketApiBaseUrl);
  }

  get isStarted() {
    return this._isStarted;
  }

  async start() {
    if (this.isStarted)
      return;

    this.exchangeWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);
    this.marketDataWebSocketClient.events.messageReceived.addListener(this.onSocketMessageReceived);

    await Promise.all([
      this.exchangeWebSocketClient.start(),
      this.marketDataWebSocketClient.start()
    ]);

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    this.exchangeWebSocketClient.events.messageReceived.removeListener(this.onSocketMessageReceived);
    this.marketDataWebSocketClient.events.messageReceived.removeListener(this.onSocketMessageReceived);

    this.exchangeWebSocketClient.stop();
    this.marketDataWebSocketClient.stop();

    this._isStarted = false;
  }

  getOrder(_accountAddress: string, _orderId: number): Promise<Order | undefined> {
    throw new Error('Method not implemented.');
  }

  getOrders(_accountAddress: string, _selector?: OrdersSelector | undefined): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }

  getSymbols(): Promise<ExchangeSymbol[]> {
    throw new Error('Method not implemented.');
  }

  getTopOfBook(symbols?: string[]): Promise<Quote[]>;
  getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
  getTopOfBook(_symbolsOrDirections?: string[] | CurrencyDirection[]): Promise<Quote[]> {
    throw new Error('Method not implemented.');
  }

  getOrderBook(symbol: string): Promise<OrderBook | undefined>;
  getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
  async getOrderBook(_symbolOrDirection: string | CurrencyDirection): Promise<OrderBook | undefined> {
    throw new Error('Method not implemented.');
  }

  addOrder(_accountAddress: string, _newOrderRequest: FilledNewOrderRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  cancelOrder(_accountAddress: string, _cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  cancelAllOrders(_accountAddress: string, _cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
  getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
  getSwap(_swapId: number, _addressOrAddresses: string | string[]): Promise<Swap | undefined> {
    throw new Error('Method not implemented.');
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
  getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
  getSwaps(_addressOrAddresses: string | string[], _selector?: SwapsSelector): Promise<Swap[]> {
    throw new Error('Method not implemented.');
  }

  protected readonly onSocketMessageReceived = (message: WebSocketResponseDto) => {
    switch (message.event) {
      case 'order':
        (this.events.orderUpdated as ToEventEmitter<typeof this.events.orderUpdated>).emit(
          mapWebSocketOrderDtoToOrder(message.data, this.exchangeSymbolsProvider)
        );
        break;

      case 'swap':
        (this.events.swapUpdated as ToEventEmitter<typeof this.events.swapUpdated>).emit(
          mapSwapDtoToSwap(message.data, this.exchangeSymbolsProvider)
        );
        break;

      case 'topOfBook':
        (this.events.topOfBookUpdated as ToEventEmitter<typeof this.events.topOfBookUpdated>).emit(
          mapQuoteDtosToQuotes(message.data)
        );
        break;

      case 'snapshot':
        this.onOrderBookSnapshotReceived(message.data);
        break;

      case 'entries':
        this.onOrderBookEntriesReceived(message.data);
        break;
    }
  };

  protected onOrderBookSnapshotReceived(orderBookDto: OrderBookDto) {
    const orderBook = mapOrderBookDtoToOrderBook(orderBookDto);
    this.orderBookProvider.setOrderBook(orderBook.symbol, orderBook);
    (this.events.orderBookSnapshot as ToEventEmitter<typeof this.events.orderBookSnapshot>).emit(orderBook);
  }

  protected onOrderBookEntriesReceived(entryDtos: WebSocketOrderBookEntryDto[]) {
    const updatedOrderBooks = mapWebSocketOrderBookEntryDtoToOrderBooks(entryDtos, this.orderBookProvider);
    for (const updatedOrderBook of updatedOrderBooks) {
      this.orderBookProvider.setOrderBook(updatedOrderBook.symbol, updatedOrderBook);
      (this.events.orderBookUpdated as ToDeferredEventEmitter<string, typeof this.events.orderBookUpdated>).emit(updatedOrderBook.symbol, updatedOrderBook);
    }
  }
}
