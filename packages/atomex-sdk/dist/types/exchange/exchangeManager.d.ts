import type { BigNumber } from 'bignumber.js';
import { ImportantDataReceivingMode } from '../common/index';
import { type Result } from '../core/index';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { CancelAllOrdersRequest, CancelOrderRequest, CurrencyDirection, ExchangeSymbol, NewOrderRequest, Order, OrderBook, OrdersSelector, Quote } from './models/index';
export declare class ExchangeManager {
    protected readonly exchangeService: ExchangeService;
    readonly events: ExchangeServiceEvents;
    constructor(exchangeService: ExchangeService);
    getOrder(accountAddress: string, orderId: number, _mode?: ImportantDataReceivingMode): Promise<Order | undefined>;
    getOrders(accountAddress: string, selector?: OrdersSelector | undefined, _mode?: ImportantDataReceivingMode): Promise<Order[]>;
    getSymbols(): Promise<ExchangeSymbol[]>;
    getTopOfBook(symbols?: string[]): Promise<Quote[]>;
    getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
    getOrderBook(symbol: string): Promise<OrderBook>;
    getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
    addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number>;
    cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
    cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number>;
    getRewardForRedeem(_nativeTokenUsdPrice: number, _nativeTokenCurrencyPrice: number): Promise<Result<BigNumber>>;
    protected attachEvents(): void;
    protected detachEvents(): void;
    protected handleExchangeServiceOrderUpdated: (updatedOrder: Order) => void;
    protected handleExchangeServiceOrderBookUpdated: (updatedOrderBook: OrderBook) => void;
    protected handleExchangeServiceTopOfBookUpdated: (updatedQuotes: Quote[]) => void;
}
