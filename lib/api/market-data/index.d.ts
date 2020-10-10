import { BookQuote, OrderBook } from "../../type";
/**
 * Get Top of Book Quotes for all or specific Symbols
 *
 * @param symbolList an array of Symbols eg. `Eth/BTC` , `XTZ/ETH`
 * @param authToken atomex authorization token
 * @returns a list of Book Quotes
 */
export declare const getTopBookQuotes: (symbolList?: string[] | undefined, authToken?: string) => Promise<BookQuote[]>;
/**
 * Get the Order Book for a particular Symbol
 *
 * @param symbol a symbol eg. `ETH/BTC`
 * @param authToken atomex authorization token
 * @returns an order book containing all orders for the particular symbol
 */
export declare const getOrderBook: (symbol: string, authToken?: string) => Promise<OrderBook>;
