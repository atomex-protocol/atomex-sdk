import type { AuthorizationManager } from '../authorization';
import { AddOrderRequest, AddSwapRequisites, AuthTokenRequest, AuthTokenResponse, BookQuote, GetOrdersRequest, GetSwapsRequest, Order, OrderBook, OrderPreview, Side, Swap, SymbolData, CurrencyConfig } from './types';
export declare class Atomex {
    private _network;
    private _baseUrl;
    private _authToken?;
    private _authorizationManager?;
    constructor(network: 'mainnet' | 'testnet', baseUrl: string, authToken?: string);
    static create(network: 'mainnet' | 'testnet' | 'localhost'): Atomex;
    setAuthorizationManager(authorizationManager: AuthorizationManager): void;
    private getLocalAuthToken;
    /**
     * Initialize Atomex authorization token
     *
     * @remarks the token can be generated using [[getAuthToken]]
     *
     * @param authToken Atomex authorization token with expiration time
     */
    setAuthToken(authToken: string): void;
    private makeRequest;
    /**
     * Get Atomex authorization token
     *
     * @remarks the message details can be generated using [[getAuthMessage]]
     *
     * @param authRequest details of the message, timeStamp and signed message with the algorithm used
     * @returns atomex authorization token with expiration time
     */
    getAuthToken(authRequest: AuthTokenRequest): Promise<AuthTokenResponse>;
    /**
     * Get list of all available symbols in Atomex
     *
     * @returns list of all the symbols and their minimum qty.
     */
    getSymbols(): Promise<SymbolData[]>;
    /**
     * Get Top of Book Quotes for all or specific Symbols
     *
     * @param symbolList an array of Symbols eg. `ETH/BTC` , `XTZ/ETH`. A list of all symbols can be found using [[getSymbols]]
     * @returns a list of Book Quotes
     */
    getQuotes(symbolList?: string[]): Promise<BookQuote[]>;
    /**
     * Get the Order Book for a particular Symbol
     *
     * @param symbol a symbol eg. `ETH/BTC`. A list of all symbols can be found using [[getSymbols]]
     * @returns an order book containing all orders for the particular symbol
     */
    getOrderBook(symbol: string): Promise<OrderBook>;
    /**
     * Create a new Order in Atomex
     *
     * @param addOrderRequest details of the order being placed
     * @returns order id
     */
    addOrder(addOrderRequest: AddOrderRequest): Promise<number>;
    /**
     * Query and filter all available orders in Atomex
     *
     * @param {string?} address
     * @param getOrdersRequest optional filters for querying all orders
     * @returns list of orders
     */
    getOrders(address?: string, getOrdersRequest?: GetOrdersRequest): Promise<Order[]>;
    /**
     * Query specific Order using Order ID
     *
     * @param orderID order id to query
     * @param {string?} address
     * @returns details of requested order
     */
    getOrder(orderID: string, address?: string): Promise<Order>;
    /**
     * Cancel an order request in Atomex
     *
     * @param orderID id of order to cancel
     * @param symbol symbol used in the order. A list of all symbols can be found using [[getSymbols]]
     * @param side side of the order `Buy` or `Sell`
     * @param {string?} address
     * @returns true/false value depending on operation success
     */
    cancelOrder(orderID: string, symbol: string, side: Side, address: string): Promise<boolean>;
    /**
     * Add Requisites to a Swap in Atomex
     *
     * @param swapID id of swap
     * @param swapRequisites swap requisites being updated
     * @returns true/false depending on operation success
     */
    addSwapRequisites(swapID: string, swapRequisites: AddSwapRequisites): Promise<boolean>;
    /**
     * Query and filter all available swaps in Atomex
     *
     *
     * @param {string?} address
     * @param getSwapsRequest filters for querying all swaps
     * @returns a list of swaps
     */
    getSwaps(address?: string, getSwapsRequest?: GetSwapsRequest): Promise<Swap[]>;
    /**
     * Query specific Swap using Swap ID
     *
     * @param swapID Atomex internal swap id
     * @param {string?} address
     * @returns details of swap requested
     */
    getSwap(swapID: string, address?: string): Promise<Swap>;
    /**
     * Returns an approximate preview of the requested amount and expected receive amount
     *
     * @param orderBook order-book received from [[getOrderBook]]
     * @param side side for the transaction Buy/Sell
     * @param amount amount received/sent
     * @param direction direction for the order - Send/Receive
     */
    getOrderPreview(orderBook: OrderBook, side: Side, amount: number, direction: 'Send' | 'Receive'): OrderPreview;
    /**
     * Split Atomex trading pair to base and quote currencies
     *
     * @param symbol Atomex trading pair {baseCurrency}/{quoteCurrency}
     */
    splitSymbol(symbol: string): [baseCurrency: string, quoteCurrency: string];
    /**
     * Get currency & network specific configuration
     *
     * @param currency L1/L2 token symbol (uppercase)
     */
    getCurrencyConfig(currency: string): CurrencyConfig;
    /**
     * Formatting an amount based on currency
     *
     * @param amount Amount received / sent
     * @param currency L1/L2 token symbol (uppercase)
     */
    formatAmount(amount: number | string, currency: string): number;
    /**
     * Get order side for a particular trading pair given the bridge direction
     *
     * @param symbol Atomex trading pair {baseCurrency}/{quoteCurrency}
     * @param fromCurrency Currency to send
     * @param toCurrency Currency to receive
     */
    getOrderSide(symbol: string, fromCurrency: string, toCurrency: string): Side;
    /**
     * Get maximum available liquidity
     *
     * @param orderBook order-book received from [[getOrderBook]]
     * @param side order side Buy/Sell
     */
    getMaxOrderSize(orderBook: OrderBook, side: Side): number;
}
