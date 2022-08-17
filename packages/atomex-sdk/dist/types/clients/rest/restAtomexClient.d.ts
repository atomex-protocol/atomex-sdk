import type { AuthorizationManager } from '../../authorization/index';
import type { Transaction } from '../../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../../common/index';
import { HttpClient } from '../../core/index';
import { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest, SwapsSelector, CurrencyDirection, ExchangeSymbolsProvider } from '../../exchange/index';
import type { Swap } from '../../swaps/index';
import type { AtomexClient } from '../atomexClient';
export interface RestAtomexClientOptions {
    atomexNetwork: AtomexNetwork;
    authorizationManager: AuthorizationManager;
    currenciesProvider: CurrenciesProvider;
    exchangeSymbolsProvider: ExchangeSymbolsProvider;
    apiBaseUrl: string;
}
export declare class RestAtomexClient implements AtomexClient {
    readonly atomexNetwork: AtomexNetwork;
    readonly events: AtomexClient['events'];
    protected readonly authorizationManager: AuthorizationManager;
    protected readonly currenciesProvider: CurrenciesProvider;
    protected readonly exchangeSymbolsProvider: ExchangeSymbolsProvider;
    protected readonly apiBaseUrl: string;
    protected readonly httpClient: HttpClient;
    private _isStarted;
    constructor(options: RestAtomexClientOptions);
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
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
    getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]>;
    getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
    getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
    getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
    getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
    private getUserIds;
    private getRequiredAuthToken;
}
