import { getQueryURL } from "../util";
import fetch from "isomorphic-unfetch";
import { getBasePath } from "../config";
import { CandleRequest } from "./type";

export const getTopBookQuotes = (symbolList?: string[]) => {
  const symbols =
    symbolList !== undefined && symbolList.length > 0
      ? symbolList.join(",")
      : "All";
  let url = new URL(getBasePath() + "/MarketData/quotes");
  url = getQueryURL(url, { symbols });
  console.log(url.toString());
  return fetch(url.toString());
};

export const getOrderBook = (symbol: string) => {
  let url = new URL(getBasePath() + "/MarketData/book");
  url = getQueryURL(url, { symbol });
  return fetch(url.toString());
};

export const getCandlesHistory = (candleRequest: CandleRequest) => {
  let url = new URL(getBasePath() + "/MarketData/candles");
  url = getQueryURL(url, { ...candleRequest });
  return fetch(url.toString());
};
