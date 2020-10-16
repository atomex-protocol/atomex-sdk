import { BookQuote, OrderBook } from "../../type";
/**
 * Get Top of Book Quotes for all or specific Symbols
 *
 * @param symbolList an array of Symbols eg. `Eth/BTC` , `XTZ/ETH`. A list of all symbols can be found using [[getSymbols]]
 * @returns a list of Book Quotes
 */
export declare const getTopBookQuotes: (symbolList?: string[] | undefined) => Promise<BookQuote[]>;
/**
 * Get the Order Book for a particular Symbol
 *
 * @param symbol a symbol eg. `ETH/BTC`. A list of all symbols can be found using [[getSymbols]]
 * @returns an order book containing all orders for the particular symbol
 */
export declare const getOrderBook: (symbol: string) => Promise<OrderBook>;
