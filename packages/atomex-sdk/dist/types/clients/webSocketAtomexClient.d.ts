import type { AuthorizationManager } from '../authorization/index';
import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, ExchangeServiceEvents, OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest, SwapsSelector, CurrencyDirection } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
export declare class WebSocketAtomexClient implements AtomexClient {
    readonly atomexNetwork: AtomexNetwork;
    protected readonly authorizationManager: AuthorizationManager;
    readonly events: ExchangeServiceEvents;
    constructor(atomexNetwork: AtomexNetwork, authorizationManager: AuthorizationManager);
    getOrder(accountAddress: string, orderId: number): Promise<Order | undefined>;
    getOrders(accountAddress: string, selector?: OrdersSelector | undefined): Promise<Order[]>;
    getSymbols(): Promise<ExchangeSymbol[]>;
    getTopOfBook(symbols?: string[]): Promise<Quote[]>;
    getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
    getOrderBook(symbol: string): Promise<OrderBook>;
    getOrderBook(direction: CurrencyDirection): Promise<OrderBook>;
    addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number>;
    cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
    cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number>;
    getSwapTransactions(swap: Swap): Promise<readonly Transaction[]>;
    getSwap(accountAddress: string, swapId: number): Promise<Swap>;
    getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
}
