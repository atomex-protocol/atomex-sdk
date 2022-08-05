import type { Transaction } from '../blockchain/index';
import type { AtomexNetwork } from '../common/index';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest, SwapsSelector, CurrencyDirection } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexClient } from './atomexClient';
export declare class MixedApiAtomexClient implements AtomexClient {
    readonly atomexNetwork: AtomexNetwork;
    protected readonly restAtomexClient: AtomexClient;
    protected readonly webSocketAtomexClient: AtomexClient;
    readonly events: AtomexClient['events'];
    constructor(atomexNetwork: AtomexNetwork, restAtomexClient: AtomexClient, webSocketAtomexClient: AtomexClient);
    getOrder(accountAddress: string, orderId: number): Promise<Order | undefined>;
    getOrders(accountAddress: string, selector?: OrdersSelector | undefined): Promise<Order[]>;
    getSymbols(): Promise<ExchangeSymbol[]>;
    getTopOfBook(symbols?: string[]): Promise<Quote[]>;
    getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
    getOrderBook(symbol: string): Promise<OrderBook | undefined>;
    getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
    addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number>;
    cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
    cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number>;
    getSwapTransactions(swap: Swap): Promise<readonly Transaction[]>;
    getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
    getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
    getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
    getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
    dispose(): void;
}
