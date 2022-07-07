import type { BigNumber } from 'bignumber.js';
import { ImportantDataReceivingMode, type CollectionSelector } from '../common/index';
import { type Result } from '../core/index';
import type { ExchangeService } from './exchangeService';
import type { ExchangeSymbol, NewOrderRequest, Order, OrderBook, Quote } from './models/index';
export declare class ExchangeManager {
    protected readonly exchangeService: ExchangeService;
    readonly orderUpdated: ExchangeService['orderUpdated'];
    readonly orderBookUpdated: ExchangeService['orderBookUpdated'];
    readonly topOfBookUpdated: ExchangeService['topOfBookUpdated'];
    constructor(exchangeService: ExchangeService);
    getOrder(orderId: string, mode?: ImportantDataReceivingMode): Promise<Result<Order | undefined>>;
    getOrders(selector?: CollectionSelector, mode?: ImportantDataReceivingMode): Promise<Result<Order[]>>;
    getSymbols(): Promise<ExchangeSymbol>;
    getTopOfBook(): Promise<Quote[]>;
    getOrderBook(): Promise<OrderBook>;
    getRewardForRedeem(nativeTokenUsdPrice: number, nativeTokenCurrencyPrice: number): Promise<Result<BigNumber>>;
    addOrder(newOrderRequest: NewOrderRequest): Promise<number>;
    cancelOrder(orderId: number): Promise<boolean>;
    cancelAllOrders(): Promise<number>;
    protected attachEvents(): void;
    protected detachEvents(): void;
    protected handleExchangeServiceOrderBookUpdated: (updatedOrderBook: OrderBook) => void;
    protected handleExchangeServiceTopOfBookUpdated: (updatedQuotes: readonly Quote[]) => void;
    protected handleExchangeServiceOrderUpdated: (updatedOrder: Order) => void;
}
