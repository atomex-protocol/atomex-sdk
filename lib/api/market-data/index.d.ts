import { CandleRequest } from "./type";
export declare const getTopBookQuotes: (symbolList?: string[] | undefined) => Promise<Response>;
export declare const getOrderBook: (symbol: string) => Promise<Response>;
export declare const getCandlesHistory: (candleRequest: CandleRequest) => Promise<Response>;
