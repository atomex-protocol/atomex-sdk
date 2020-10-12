import { BookQuote, OrderBook } from "../../type";
import { getBasePath, getQueryURL, makeApiRequest } from "../util";

/**
 * Get Top of Book Quotes for all or specific Symbols
 *
 * @param symbolList an array of Symbols eg. `Eth/BTC` , `XTZ/ETH`. A list of all symbols can be found using [[getSymbols]]
 * @param authToken atomex authorization token
 * @returns a list of Book Quotes
 */
export const getTopBookQuotes = async (
  symbolList?: string[],
  authToken = "",
): Promise<BookQuote[]> => {
  const symbols =
    symbolList !== undefined && symbolList.length > 0
      ? symbolList.join(",")
      : "All";

  let url = new URL(getBasePath() + "/MarketData/quotes");
  url = getQueryURL(url, { symbols });

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};

/**
 * Get the Order Book for a particular Symbol
 *
 * @param symbol a symbol eg. `ETH/BTC`. A list of all symbols can be found using [[getSymbols]]
 * @param authToken atomex authorization token
 * @returns an order book containing all orders for the particular symbol
 */
export const getOrderBook = async (
  symbol: string,
  authToken = "",
): Promise<OrderBook> => {
  let url = new URL(getBasePath() + "/MarketData/book");
  url = getQueryURL(url, { symbol });

  return makeApiRequest(url.toString(), {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
};
