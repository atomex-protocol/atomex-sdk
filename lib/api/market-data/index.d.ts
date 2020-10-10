import { BookQuote, OrderBook } from "../../type";
export declare const getTopBookQuotes: (symbolList?: string[] | undefined, authToken?: string) => Promise<BookQuote[]>;
export declare const getOrderBook: (symbol: string, authToken?: string) => Promise<OrderBook>;
