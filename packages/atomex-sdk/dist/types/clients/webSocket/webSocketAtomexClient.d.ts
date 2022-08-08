import type { AuthorizationManager } from '../../authorization/index';
import type { Transaction } from '../../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../../common/index';
import type { Order, OrderBook, Quote, ExchangeSymbol, NewOrderRequest, OrdersSelector, CancelOrderRequest, CancelAllOrdersRequest, SwapsSelector, CurrencyDirection, ExchangeSymbolsProvider } from '../../exchange/index';
import type { Swap } from '../../swaps/index';
import type { AtomexClient } from '../atomexClient';
import type { WebSocketResponseDto } from '../dtos';
import { ExchangeWebSocketClient } from './exchangeWebSocketClient';
import { MarketDataWebSocketClient } from './marketDataWebSocketClient';
export interface WebSocketAtomexClientOptions {
    atomexNetwork: AtomexNetwork;
    authorizationManager: AuthorizationManager;
    currenciesProvider: CurrenciesProvider;
    exchangeSymbolsProvider: ExchangeSymbolsProvider;
    webSocketApiBaseUrl: string;
}
export declare class WebSocketAtomexClient implements AtomexClient {
    readonly atomexNetwork: AtomexNetwork;
    readonly events: AtomexClient['events'];
    protected readonly authorizationManager: AuthorizationManager;
    protected readonly exchangeSymbolsProvider: ExchangeSymbolsProvider;
    protected readonly currenciesProvider: CurrenciesProvider;
    protected readonly webSocketApiBaseUrl: string;
    protected readonly marketDataWebSocketClient: MarketDataWebSocketClient;
    protected readonly exchangeWebSocketClient: ExchangeWebSocketClient;
    private _isStarted;
    constructor(options: WebSocketAtomexClientOptions);
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    getOrder(_accountAddress: string, _orderId: number): Promise<Order | undefined>;
    getOrders(_accountAddress: string, _selector?: OrdersSelector | undefined): Promise<Order[]>;
    getSymbols(): Promise<ExchangeSymbol[]>;
    getTopOfBook(symbols?: string[]): Promise<Quote[]>;
    getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
    getOrderBook(symbol: string): Promise<OrderBook | undefined>;
    getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
    addOrder(_accountAddress: string, _newOrderRequest: NewOrderRequest): Promise<number>;
    cancelOrder(_accountAddress: string, _cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
    cancelAllOrders(_accountAddress: string, _cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number>;
    getSwapTransactions(_swap: Swap): Promise<readonly Transaction[]>;
    getSwap(swapId: number, accountAddress: string): Promise<Swap | undefined>;
    getSwap(swapId: number, accountAddresses: string[]): Promise<Swap | undefined>;
    getSwaps(accountAddress: string, selector?: SwapsSelector): Promise<Swap[]>;
    getSwaps(accountAddresses: string[], selector?: SwapsSelector): Promise<Swap[]>;
    protected readonly onSocketMessageReceived: (message: WebSocketResponseDto) => void;
}