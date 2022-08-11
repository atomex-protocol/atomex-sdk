import { EventEmitter } from '../../src/core/index';
import type {
  Order, ExchangeSymbol, Quote, CurrencyDirection,
  OrderBook, NewOrderRequest, CancelOrderRequest, CancelAllOrdersRequest
} from '../../src/exchange/index';
import type { AtomexClient, AtomexNetwork, OrdersSelector, Swap, SwapsSelector, Transaction } from '../../src/index';

export interface TestAtomexClientData {
  swaps: Swap[];
  symbols: ExchangeSymbol[];
  orders: Order[];
  quotes: Quote[];
}

export class TestAtomexClient implements AtomexClient {
  readonly events: AtomexClient['events'] = {
    swapUpdated: new EventEmitter(),
    orderUpdated: new EventEmitter(),
    orderBookUpdated: new EventEmitter(),
    topOfBookUpdated: new EventEmitter()
  };

  private _isStarted = false;

  constructor(readonly atomexNetwork: AtomexNetwork) {
  }

  get isStarted() {
    return this._isStarted;
  }

  async start() {
    if (this.isStarted)
      return;

    this._isStarted = true;
  }

  stop(): void {
    if (!this.isStarted)
      return;

    this._isStarted = false;
  }

  getOrder = jest.fn<Promise<Order | undefined>, [accountAddress: string, orderId: number]>();
  getOrders = jest.fn<Promise<Order[]>, [accountAddress: string, selector?: OrdersSelector | undefined]>();
  getSymbols = jest.fn<Promise<ExchangeSymbol[]>, []>();

  getTopOfBook = jest.fn<Promise<Quote[]>, [symbolsOrDirections?: string[] | CurrencyDirection[]]>();
  getOrderBook = jest.fn<Promise<OrderBook | undefined>, [symbolOrDirection: string | CurrencyDirection]>();

  addOrder(_accountAddress: string, _newOrderRequest: NewOrderRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  cancelOrder(_accountAddress: string, _cancelOrderRequest: CancelOrderRequest): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  cancelAllOrders(_accountAddress: string, _cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number> {
    throw new Error('Method not implemented.');
  }

  getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
  getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
  getSwap(_swapId: unknown, _accountAddresses: unknown): Promise<Swap | undefined> {
    throw new Error('Method not implemented.');
  }

  getSwaps(accountAddress: string, selector?: SwapsSelector | undefined): Promise<Swap[]>;
  getSwaps(accountAddresses: string[], selector?: SwapsSelector | undefined): Promise<Swap[]>;
  getSwaps(_accountAddresses: unknown, _selector?: unknown): Promise<Swap[]> {
    throw new Error('Method not implemented.');
  }

  getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]> {
    throw new Error('Method not implemented.');
  }

  resetAllMocks() {
    this.getOrder.mockReset();
    this.getOrders.mockReset();
    this.getSymbols.mockReset();
    this.getTopOfBook.mockReset();
    this.getOrderBook.mockReset();
  }
}
