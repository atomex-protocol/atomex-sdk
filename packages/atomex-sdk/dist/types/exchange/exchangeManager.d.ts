import { BigNumber } from 'bignumber.js';
import { AtomexService, DataSource, ImportantDataReceivingMode, Side } from '../common/index';
import type { ExchangeService, ExchangeServiceEvents } from './exchangeService';
import type { ManagedExchangeSymbolsProvider } from './exchangeSymbolsProvider/index';
import type { CancelAllOrdersRequest, CancelOrderRequest, CurrencyDirection, ExchangeSymbol, OrderPreviewParameters as OrderPreviewParameters, NewOrderRequest, Order, OrderBook, OrderPreview, OrdersSelector, Quote, OrderType, NormalizedOrderPreviewParameters, SymbolLiquidity, SymbolLiquidityParameters } from './models/index';
import type { ManagedOrderBookProvider } from './orderBookProvider';
export interface ExchangeManagerOptions {
    exchangeService: ExchangeService;
    symbolsProvider: ManagedExchangeSymbolsProvider;
    orderBookProvider: ManagedOrderBookProvider;
}
export declare class ExchangeManager implements AtomexService {
    readonly events: ExchangeServiceEvents;
    protected readonly exchangeService: ExchangeService;
    protected readonly symbolsProvider: ManagedExchangeSymbolsProvider;
    protected readonly orderBookProvider: ManagedOrderBookProvider;
    private _isStarted;
    constructor(options: ExchangeManagerOptions);
    get isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    getOrder(accountAddress: string, orderId: number, _mode?: ImportantDataReceivingMode): Promise<Order | undefined>;
    getOrders(accountAddress: string, selector?: OrdersSelector | undefined, _mode?: ImportantDataReceivingMode): Promise<Order[]>;
    getSymbol(name: string, dataSource?: DataSource): Promise<ExchangeSymbol | undefined>;
    getSymbols(dataSource?: DataSource): Promise<readonly ExchangeSymbol[]>;
    getTopOfBook(symbols?: string[]): Promise<Quote[]>;
    getTopOfBook(directions?: CurrencyDirection[]): Promise<Quote[]>;
    getOrderBook(symbol: string): Promise<OrderBook | undefined>;
    getOrderBook(direction: CurrencyDirection): Promise<OrderBook | undefined>;
    addOrder(accountAddress: string, newOrderRequest: NewOrderRequest): Promise<number>;
    cancelOrder(accountAddress: string, cancelOrderRequest: CancelOrderRequest): Promise<boolean>;
    cancelAllOrders(accountAddress: string, cancelAllOrdersRequest: CancelAllOrdersRequest): Promise<number>;
    getOrderPreview(orderPreviewParameters: OrderPreviewParameters | NormalizedOrderPreviewParameters): Promise<OrderPreview | undefined>;
    getAvailableLiquidity(parameters: SymbolLiquidityParameters): Promise<SymbolLiquidity | undefined>;
    protected attachEvents(): void;
    protected detachEvents(): void;
    protected handleExchangeServiceOrderUpdated: (updatedOrder: Order) => void;
    protected handleExchangeServiceOrderBookSnapshot: (orderBook: OrderBook) => Promise<void>;
    protected handleExchangeServiceOrderBookUpdated: (updatedOrderBook: OrderBook) => Promise<void>;
    protected handleExchangeServiceTopOfBookUpdated: (updatedQuotes: readonly Quote[]) => void;
    protected normalizeOrderPreviewParametersIfNeeded(orderPreviewParameters: OrderPreviewParameters | NormalizedOrderPreviewParameters): NormalizedOrderPreviewParameters;
    protected findOrderBookEntry(symbol: string, side: Side, orderType: OrderType, amount: BigNumber, isQuoteCurrencyAmount: boolean): Promise<import("./models/orderBook").OrderBookEntry | undefined>;
    protected getCachedOrderBook(symbol: string): Promise<OrderBook | undefined>;
}
