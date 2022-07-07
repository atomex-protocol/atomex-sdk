import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork, CollectionSelector } from '../common/index';
import { type PublicEventEmitter } from '../core';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
export declare class RestAtomexClient implements AtomexClient {
    readonly atomexNetwork: AtomexNetwork;
    protected readonly authorizationManager: AuthorizationManager;
    readonly orderUpdated: PublicEventEmitter<readonly [updatedOrder: Order]>;
    readonly orderBookUpdated: PublicEventEmitter<readonly [updatedOrderBook: OrderBook]>;
    readonly topOfBookUpdated: PublicEventEmitter<readonly [updatedQuotes: readonly Quote[]]>;
    constructor(atomexNetwork: AtomexNetwork, authorizationManager: AuthorizationManager);
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
