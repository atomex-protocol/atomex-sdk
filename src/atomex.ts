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
    if (params !== undefined) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key]),
      );
    }

    const headers: Record<string, string> = {};
    if (auth) {
      if (this._authToken === undefined) {
        throw new Error("Auth token is undefined");
      }
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

  getOrderSize(
    amount: number,
    price: number,
    side: Side,
    direction: "Send" | "Receive",
  ): number {
    switch (side + direction) {
      case "BuySend":
      case "SellReceive":
        return amount / price;
      case "BuyReceive":
      case "SellSend":
        return amount;
      default:
        throw new Error("combination not possible");
    }
  }

  filterEntry(
    entry: Entry,
    amount: number,
    side: Side,
    direction: "Send" | "Receive",
  ): boolean {
    return (
      entry.side !== side &&
      Math.max(...entry.qtyProfile) >=
        this.getOrderSize(amount, entry.price, side, direction)
    );
  }

  /**
   * Returns an approximate preview of the requested amount and expected receive amount
   *
   * @param orderBook order-book received from [[getOrderBook]]
   * @param side side for the transaction Buy/Sell
   * @param amount amount received/sent
   * @param direction direction for the order - Send/Receive
   */
  getOrderPreview(
    orderBook: OrderBook,
    side: Side,
    amount: number,
    direction: "Send" | "Receive",
  ): OrderPreview {
    let entry: Entry | undefined, newAmount: number;
    if (side == "Buy") {
      // find least price entry
      entry = [...orderBook.entries]
        .reverse()
        .find((x) => this.filterEntry(x, amount, side, direction));
    } else {
      // find max price entry
      entry = orderBook.entries.find((x) =>
        this.filterEntry(x, amount, side, direction),
      );
    }

    if (entry == undefined) {
      throw new Error("No matching entry found");
    }

    if (direction == "Send") {
      return {
        price: entry.price,
        amountSent: amount,
        amountReceived: this.getOrderSize(amount, entry.price, side, direction),
      };
    }
    return {
      price: entry.price,
      amountSent: this.getOrderSize(amount, entry.price, side, direction),
      amountReceived: amount,
    };
  }
}
