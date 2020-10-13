import { BookQuote, OrderBook } from "../../type";
/**
 * Get Top of Book Quotes for all or specific Symbols
 *
 * @param symbolList an array of Symbols eg. `Eth/BTC` , `XTZ/ETH`. A list of all symbols can be found using [[getSymbols]]
 * @param authToken atomex authorization token
 * @returns a list of Book Quotes
 */
export declare const getTopBookQuotes: (authToken?: string, symbolList?: string[] | undefined) => Promise<BookQuote[]>;
/**
 * Get the Order Book for a particular Symbol
 *
 * @param symbol a symbol eg. `ETH/BTC`. A list of all symbols can be found using [[getSymbols]]
 * @param authToken atomex authorization token
 * @returns an order book containing all orders for the particular symbol
 */
export declare const getOrderBook: (authToken: string | undefined, symbol: string) => Promise<OrderBook>;
