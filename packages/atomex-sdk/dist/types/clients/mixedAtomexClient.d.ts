import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, CollectionSelector } from '../common/index';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
export declare class MixedApiAtomexClient implements AtomexClient {
    readonly atomexNetwork: AtomexNetwork;
    readonly restAtomexClient: AtomexClient;
    readonly webSocketAtomexClient: AtomexClient;
    constructor(atomexNetwork: AtomexNetwork, restAtomexClient: AtomexClient, webSocketAtomexClient: AtomexClient);
    get orderUpdated(): import("../core/eventEmitter").PublicEventEmitter<readonly [updatedOrder: Order]>;
    get orderBookUpdated(): import("../core/eventEmitter").PublicEventEmitter<readonly [updatedOrderBook: OrderBook]>;
    get topOfBookUpdated(): import("../core/eventEmitter").PublicEventEmitter<readonly [updatedQuotes: readonly Quote[]]>;
    getOrder(orderId: string): Promise<Order | undefined>;
    getOrders(selector?: CollectionSelector | undefined): Promise<Order[]>;
    getSymbols(): Promise<ExchangeSymbol>;
    getTopOfBook(): Promise<Quote[]>;
    getOrderBook(): Promise<OrderBook>;
    addOrder(newOrderRequest: NewOrderRequest): Promise<number>;
    cancelOrder(orderId: number): Promise<boolean>;
    cancelAllOrders(): Promise<number>;
    getSwapTransactions(swap: Swap): Promise<readonly Transaction[]>;
    getSwap(swapId: string): Promise<Swap>;
}
