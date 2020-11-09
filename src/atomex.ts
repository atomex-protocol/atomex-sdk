import { 
  AuthResponse, GetTokenRequest as AuthRequest, BookQuote, SymbolData,
  OrderBook, AddOrderRequest, GetOrdersRequest, Order, Side, 
  AddSwapRequisites, GetSwapsRequest, Swap
} from "./types";
import fetch from "isomorphic-unfetch";
import config from "./config.json";
import { now, dt2ts } from "./helpers";

interface Query {
  [key: string]: any;
}

export class Atomex {
  private _baseUrl: string;
  private _authToken?: AuthResponse;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  static create(network: "mainnet" | "testnet" | "localhost"): Atomex {
    return new Atomex(config.api[network].baseUrl);
  }

  setAuthToken(authToken: AuthResponse) {
    if (dt2ts(authToken.expires) < now())
        throw new Error("Auth token is expired");

    return this._authToken = authToken;
  }
  
  private async makeRequest<T>(
    method: "get" | "post" | "delete",
    path: string,
    auth = false,
    params?: Query,
    payload?: Query
  ): Promise<T> {
    let url = new URL(path, this._baseUrl);
    if (params !== undefined)
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    let headers: Record<string, string> = {};
    if (auth) {
      if (this._authToken === undefined)
        throw new Error("Auth token is undefined");
      if (dt2ts(this._authToken.expires) < now())
        throw new Error("Auth token is expired");

      headers["Authorization"] = `Bearer ${this._authToken}`;
    }

    let body = undefined;
    if (method === "post" && payload !== undefined) {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body
    });
    if (response.ok) {
      return response.json();
    } else {
      const errBody = await response.text();
      throw Error(errBody);
    }
  };

  /**
   * Get Atomex authorization token
   *
   * @remarks the message details can be generated using [[getAuthMessage]]
   *
   * @param authRequest details of the message, timeStamp and signed message with the algorithm used
   * @returns atomex authorization token with expiration time
   */
  async getAuthToken(authRequest: AuthRequest): Promise<AuthResponse> {
    return this.makeRequest("post", "/Token", false, {}, authRequest);
  };

  /**
   * Get list of all available symbols in Atomex
   *
   * @returns list of all the symbols and their minimum qty.
   */
  async getSymbols(): Promise<SymbolData[]> {
    return this.makeRequest("get", "/Symbols", false);
  };

  /**
   * Get Top of Book Quotes for all or specific Symbols
   *
   * @param symbolList an array of Symbols eg. `Eth/BTC` , `XTZ/ETH`. A list of all symbols can be found using [[getSymbols]]
   * @returns a list of Book Quotes
   */
  async getTopBookQuotes(symbolList?: string[]): Promise<BookQuote[]> {
    const symbols =
      symbolList !== undefined && symbolList.length > 0
        ? symbolList.join(",")
        : "All";

    return this.makeRequest("get", "/MarketData/quotes", false, { symbols });
  };

  /**
   * Get the Order Book for a particular Symbol
   *
   * @param symbol a symbol eg. `ETH/BTC`. A list of all symbols can be found using [[getSymbols]]
   * @returns an order book containing all orders for the particular symbol
   */
  async getOrderBook(symbol: string): Promise<OrderBook> {
    return this.makeRequest("get", "/MarketData/book", false, { symbol });
  };

  /**
   * Create a new Order in Atomex
   *
   * @param addOrderRequest details of the order being placed
   * @param authToken atomex authorization token
   * @returns order id
   */
  async addOrder(addOrderRequest: AddOrderRequest): Promise<number> {
    return this.makeRequest<Record<string, number>>("post", "/Orders", true, {}, addOrderRequest)
      .then(res => res["orderId"]);
  };

  /**
   * Query and filter all available orders in Atomex
   *
   * @param getOrdersRequest optional filters for querying all orders
   * @param authToken atomex authorization token
   * @returns list of orders
   */
  async getOrders(getOrdersRequest?: GetOrdersRequest): Promise<Order[]> {
    return this.makeRequest("get", "/Orders", true, { ...getOrdersRequest });
  };

  /**
   * Query specific Order using Order ID
   *
   * @param orderID order id to query
   * @param authToken atomex authorization token
   * @returns details of requested order
   */
  async getOrder(orderID: string): Promise<Order> {
    return this.makeRequest("get", `/Orders/${orderID}`, true);
  };

  /**
   * Cancel an order request in Atomex
   *
   * @param orderID id of order to cancel
   * @param symbol symbol used in the order. A list of all symbols can be found using [[getSymbols]]
   * @param side side of the order `Buy` or `Sell`
   * @param authToken atomex authorization token
   * @returns true/false value depending on operation success
   */
  async cancelOrder(orderID: string, symbol: string, side: Side): Promise<boolean> {
    return this.makeRequest<Record<string, boolean>>("delete", `/Orders/${orderID}`, true, { symbol, side })
      .then(res => res["result"]);
  };

  /**
   * Add Requisites to a Swap in Atomex
   *
   * @param swapID id of swap
   * @param swapRequisites swap requisites being updated
   * @param authToken atomex authorization token
   * @returns true/false depending on operation success
   */
  async addSwapRequisites(swapID: string, swapRequisites: AddSwapRequisites): Promise<boolean> {
    return this.makeRequest<Record<string, boolean>>("post", `/Swaps/${swapID}/requisites`, true, {}, swapRequisites)
      .then(res => res["result"])
  };

  /**
   * Query and filter all available swaps in Atomex
   *
   * @param getSwapsRequest filters for querying all swaps
   * @param authToken atomex authorization token
   * @returns a list of swaps
   */
  async getSwaps(getSwapsRequest?: GetSwapsRequest): Promise<Swap[]> {
    return this.makeRequest("get", "/Swaps", true, { ...getSwapsRequest });
  };

  /**
   * Query specific Swap using Swap ID
   *
   * @param swapID id of swap
   * @param authToken atomex authorization token
   * @returns details of swap requested
   */
  async getSwap(swapID: string): Promise<Swap> {
    return this.makeRequest("get", `/Swaps/${swapID}`, true);
  };
}
