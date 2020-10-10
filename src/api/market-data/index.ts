import { BookQuote, OrderBook } from "../../type";
import { getBasePath, getQueryURL, makeApiRequest } from "../util";

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
