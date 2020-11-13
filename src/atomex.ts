import fetch from "isomorphic-unfetch";
import config from "./config.json";
import {
  AddOrderRequest,
  AddSwapRequisites,
  AuthTokenRequest as AuthRequest,
  AuthTokenResponse,
  BookQuote,
  Entry,
  GetOrdersRequest,
  GetSwapsRequest,
  Order,
  OrderBook,
  OrderPreview,
  Side,
  Swap,
  SymbolData,
} from "./types";

interface Query {
  [key: string]: any;
}
type ArithmeticOP = (a: number, b: number) => number;
type RelationalOP = (a: number, b: number) => boolean;
const divOP: ArithmeticOP = (a, b) => a / b;
const noOP: ArithmeticOP = (a, b) => a;
const ltOP: RelationalOP = (a, b) => a < b;
const gtOP: RelationalOP = (a, b) => a > b;

export class Atomex {
  private _baseUrl: string;
  private _authToken?: string;

  constructor(baseUrl: string, authToken?: string) {
    this._baseUrl = baseUrl;
    this._authToken = authToken;
  }

  static create(network: "mainnet" | "testnet" | "localhost"): Atomex {
    return new Atomex(config.api[network].baseUrl);
  }

  /**
   * Initialize Atomex authorization token
   *
   * @remarks the token can be generated using [[getAuthToken]]
   *
   * @param authToken Atomex authorization token with expiration time
   */
  setAuthToken(authToken: string) {
    this._authToken = authToken;
  }

  private async makeRequest<T>(
    method: "get" | "post" | "delete",
    path: string,
    auth = false,
    params?: Query,
    payload?: Query,
  ): Promise<T> {
    const url = new URL(path, this._baseUrl);
    if (params !== undefined)
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key]),
      );

    const headers: Record<string, string> = {};
    if (auth) {
      if (this._authToken === undefined)
        throw new Error("Auth token is undefined");

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
      body,
    });
    if (response.ok) {
      return response.json();
    } else {
      const errBody = await response.text();
      throw Error(errBody);
    }
  }

  /**
   * Get Atomex authorization token
   *
   * @remarks the message details can be generated using [[getAuthMessage]]
   *
   * @param authRequest details of the message, timeStamp and signed message with the algorithm used
   * @returns atomex authorization token with expiration time
   */
  async getAuthToken(authRequest: AuthRequest): Promise<AuthTokenResponse> {
    return this.makeRequest("post", "/v1/Token", false, {}, authRequest);
  }

  /**
   * Get list of all available symbols in Atomex
   *
   * @returns list of all the symbols and their minimum qty.
   */
  async getSymbols(): Promise<SymbolData[]> {
    return this.makeRequest("get", "/v1/Symbols", false);
  }

  /**
   * Get Top of Book Quotes for all or specific Symbols
   *
   * @param symbolList an array of Symbols eg. `ETH/BTC` , `XTZ/ETH`. A list of all symbols can be found using [[getSymbols]]
   * @returns a list of Book Quotes
   */
  async getQuotes(symbolList?: string[]): Promise<BookQuote[]> {
    const symbols =
      symbolList !== undefined && symbolList.length > 0
        ? symbolList.join(",")
        : "All";
    return this.makeRequest("get", "/v1/MarketData/quotes", false, { symbols });
  }

  /**
   * Get the Order Book for a particular Symbol
   *
   * @param symbol a symbol eg. `ETH/BTC`. A list of all symbols can be found using [[getSymbols]]
   * @returns an order book containing all orders for the particular symbol
   */
  async getOrderBook(symbol: string): Promise<OrderBook> {
    return this.makeRequest("get", "/v1/MarketData/book", false, { symbol });
  }

  /**
   * Create a new Order in Atomex
   *
   * @param addOrderRequest details of the order being placed
   * @returns order id
   */
  async addOrder(addOrderRequest: AddOrderRequest): Promise<number> {
    return this.makeRequest<Record<string, number>>(
      "post",
      "/Orders",
      true,
      {},
      addOrderRequest,
    ).then((res) => res["orderId"]);
  }

  /**
   * Query and filter all available orders in Atomex
   *
   * @param getOrdersRequest optional filters for querying all orders
   * @returns list of orders
   */
  async getOrders(getOrdersRequest?: GetOrdersRequest): Promise<Order[]> {
    return this.makeRequest("get", "/v1/Orders", true, { ...getOrdersRequest });
  }

  /**
   * Query specific Order using Order ID
   *
   * @param orderID order id to query
   * @returns details of requested order
   */
  async getOrder(orderID: string): Promise<Order> {
    return this.makeRequest("get", `/v1/Orders/${orderID}`, true);
  }

  /**
   * Cancel an order request in Atomex
   *
   * @param orderID id of order to cancel
   * @param symbol symbol used in the order. A list of all symbols can be found using [[getSymbols]]
   * @param side side of the order `Buy` or `Sell`
   * @param authToken atomex authorization token
   * @returns true/false value depending on operation success
   */
  async cancelOrder(
    orderID: string,
    symbol: string,
    side: Side,
  ): Promise<boolean> {
    return this.makeRequest<Record<string, boolean>>(
      "delete",
      `/v1/Orders/${orderID}`,
      true,
      { symbol, side },
    ).then((res) => res["result"]);
  }

  /**
   * Add Requisites to a Swap in Atomex
   *
   * @param swapID id of swap
   * @param swapRequisites swap requisites being updated
   * @returns true/false depending on operation success
   */
  async addSwapRequisites(
    swapID: string,
    swapRequisites: AddSwapRequisites,
  ): Promise<boolean> {
    return this.makeRequest<Record<string, boolean>>(
      "post",
      `/v1/Swaps/${swapID}/requisites`,
      true,
      {},
      swapRequisites,
    ).then((res) => res["result"]);
  }

  /**
   * Query and filter all available swaps in Atomex
   *
   * @param getSwapsRequest filters for querying all swaps
   * @returns a list of swaps
   */
  async getSwaps(getSwapsRequest?: GetSwapsRequest): Promise<Swap[]> {
    return this.makeRequest("get", "/v1/Swaps", true, { ...getSwapsRequest });
  }

  /**
   * Query specific Swap using Swap ID
   *
   * @param swapID Atomex internal swap id
   * @returns details of swap requested
   */
  async getSwap(swapID: string): Promise<Swap> {
    return this.makeRequest("get", `/v1/Swaps/${swapID}`, true);
  }

  private getSuitableEntry(
    entries: Entry[],
    side: Side,
    amount: number,
    qtyOp: ArithmeticOP,
    relOp: RelationalOP,
  ): Entry {
    let reqEntry = -1;
    for (let i = 0; i < entries.length; i++) {
      if (
        entries[i].side == side &&
        Math.max(...entries[i].qtyProfile) >= qtyOp(amount, entries[i].price)
      ) {
        if (reqEntry == -1) reqEntry = i;
        else if (relOp(entries[i].price, entries[reqEntry].price)) {
          reqEntry = i;
        }
      }
    }
    if (reqEntry == -1) {
      throw new Error("No suitable entry found");
    }
    return entries[reqEntry];
  }

  getOrderPreview(
    orderBook: OrderBook,
    side: Side,
    amount: number,
    direction: "Send" | "Receive",
  ): OrderPreview {
    let entry: Entry, newAmount: number;
    if (side === "Buy") {
      if (direction == "Send") {
        entry = this.getSuitableEntry(
          orderBook.entries,
          "Sell",
          amount,
          divOP,
          ltOP,
        );
        newAmount = amount / entry.price;
      } else {
        entry = this.getSuitableEntry(
          orderBook.entries,
          "Sell",
          amount,
          noOP,
          ltOP,
        );
        newAmount = amount * entry.price;
      }
    } else {
      if (direction == "Send") {
        entry = this.getSuitableEntry(
          orderBook.entries,
          "Buy",
          amount,
          noOP,
          gtOP,
        );
        newAmount = amount * entry.price;
      } else {
        entry = this.getSuitableEntry(
          orderBook.entries,
          "Buy",
          amount,
          divOP,
          gtOP,
        );
        newAmount = amount / entry.price;
      }
    }
    if (direction == "Send")
      return {
        price: entry.price,
        amountSent: amount,
        amountReceived: newAmount,
      };
    return {
      price: entry.price,
      amountSent: newAmount,
      amountReceived: amount,
    };
  }
}
