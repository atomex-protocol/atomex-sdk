import type { AuthorizationManager } from '../authorization';
import config from './config.json';
import type {
  AddOrderRequest,
  AddSwapRequisites,
  AuthTokenRequest,
  AuthTokenResponse,
  BookQuote,
  GetOrdersRequest,
  GetSwapsRequest,
  Order,
  OrderBook,
  OrderPreview,
  Side,
  Swap,
  SymbolData,
  CurrencyConfig,
} from './types';

interface Query {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class Atomex {
  private _network: 'mainnet' | 'testnet';
  private _baseUrl: string;
  private _authToken?: string;
  private _authorizationManager?: AuthorizationManager;

  constructor(
    network: 'mainnet' | 'testnet',
    baseUrl: string,
    authToken?: string,
  ) {
    this._network = network;
    this._baseUrl = baseUrl;
    this._authToken = authToken;
  }

  static create(network: 'mainnet' | 'testnet' | 'localhost'): Atomex {
    return new Atomex(
      network == 'mainnet' ? 'mainnet' : 'testnet',
      config.api[network].baseUrl,
    );
  }

  setAuthorizationManager(authorizationManager: AuthorizationManager) {
    this._authorizationManager = authorizationManager;
  }

  private getLocalAuthToken(address: string) {
    const authToken = this._authorizationManager?.getAuthToken(address);

    return authToken?.value;
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
    method: 'get' | 'post' | 'delete',
    path: string,
    auth: boolean | string = false,
    params?: Query,
    payload?: Query,
  ): Promise<T> {
    const url = new URL(path, this._baseUrl);
    if (params !== undefined) {
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key]),
      );
    }

    const headers: Record<string, string> = {};
    if (auth) {
      const authToken = typeof auth === 'string' ? this.getLocalAuthToken(auth) : this._authToken;

      if (!authToken)
        throw new Error('Auth token is undefined');

      headers['Authorization'] = `Bearer ${authToken}`;
    }

    let body = undefined;
    if (method === 'post' && payload !== undefined) {
      body = JSON.stringify(payload);
      headers['Content-Type'] = 'application/json';
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
  async getAuthToken(
    authRequest: AuthTokenRequest,
  ): Promise<AuthTokenResponse> {
    return this.makeRequest('post', '/v1/Token', false, {}, authRequest);
  }

  /**
   * Get list of all available symbols in Atomex
   *
   * @returns list of all the symbols and their minimum qty.
   */
  async getSymbols(): Promise<SymbolData[]> {
    return this.makeRequest('get', '/v1/Symbols', false);
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
        ? symbolList.join(',')
        : 'All';
    return this.makeRequest('get', '/v1/MarketData/quotes', false, { symbols });
  }

  /**
   * Get the Order Book for a particular Symbol
   *
   * @param symbol a symbol eg. `ETH/BTC`. A list of all symbols can be found using [[getSymbols]]
   * @returns an order book containing all orders for the particular symbol
   */
  async getOrderBook(symbol: string): Promise<OrderBook> {
    return this.makeRequest('get', '/v1/MarketData/book', false, { symbol });
  }

  /**
   * Create a new Order in Atomex
   *
   * @param addOrderRequest details of the order being placed
   * @returns order id
   */
  async addOrder(addOrderRequest: AddOrderRequest): Promise<number> {
    const [baseConfig, quoteConfig] = this.splitSymbol(
      addOrderRequest.symbol,
    ).map(x => this.getCurrencyConfig(x)) as [CurrencyConfig, CurrencyConfig];
    const query: Query = addOrderRequest;
    query.requisites = {
      baseCurrencyContract: baseConfig.contractAddress,
      quoteCurrencyContract: quoteConfig.contractAddress,
      ...query.requisites,
    };

    return this.makeRequest<Record<string, number>>(
      'post',
      '/v1/Orders',
      addOrderRequest.requisites?.receivingAddress || true,
      {},
      query,
    ).then(res => res['orderId']!);
  }

  /**
   * Query and filter all available orders in Atomex
   *
   * @param {string?} address
   * @param getOrdersRequest optional filters for querying all orders
   * @returns list of orders
   */
  async getOrders(address?: string, getOrdersRequest?: GetOrdersRequest): Promise<Order[]> {
    return this.makeRequest('get', '/v1/Orders', address || true, { ...getOrdersRequest });
  }

  /**
   * Query specific Order using Order ID
   *
   * @param orderID order id to query
   * @param {string?} address
   * @returns details of requested order
   */
  async getOrder(orderID: string, address?: string): Promise<Order> {
    return this.makeRequest('get', `/v1/Orders/${orderID}`, address || true);
  }

  /**
   * Cancel an order request in Atomex
   *
   * @param orderID id of order to cancel
   * @param symbol symbol used in the order. A list of all symbols can be found using [[getSymbols]]
   * @param side side of the order `Buy` or `Sell`
   * @param {string?} address
   * @returns true/false value depending on operation success
   */
  async cancelOrder(
    orderID: string,
    symbol: string,
    side: Side,
    address: string,
  ): Promise<boolean> {
    return this.makeRequest<Record<string, boolean>>(
      'delete',
      `/v1/Orders/${orderID}`,
      address || true,
      { symbol, side },
    ).then(res => res['result']!);
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
      'post',
      `/v1/Swaps/${swapID}/requisites`,
      swapRequisites?.receivingAddress || true,
      {},
      swapRequisites,
    ).then(res => res['result']!);
  }

  /**
   * Query and filter all available swaps in Atomex
   *
   * 
   * @param {string?} address
   * @param getSwapsRequest filters for querying all swaps
   * @returns a list of swaps
   */
  async getSwaps(address?: string, getSwapsRequest?: GetSwapsRequest): Promise<Swap[]> {
    return this.makeRequest('get', '/v1/Swaps', address || true, { ...getSwapsRequest });
  }

  /**
   * Query specific Swap using Swap ID
   *
   * @param swapID Atomex internal swap id
   * @param {string?} address
   * @returns details of swap requested
   */
  async getSwap(swapID: string, address?: string): Promise<Swap> {
    return this.makeRequest('get', `/v1/Swaps/${swapID}`, address || true);
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
    direction: 'Send' | 'Receive',
  ): OrderPreview {
    const availablePrices = orderBook.entries
      .filter(entry => {
        if (entry.side == side) {
          return false;
        }
        const getOrderSize = () => {
          switch (side + direction) {
            case 'BuySend':
            case 'SellReceive':
              return amount / entry.price;
            default:
              return amount;
          }
        };
        return getOrderSize() <= Math.max(...entry.qtyProfile);
      })
      .map(entry => entry.price);

    if (availablePrices.length == 0) {
      throw new Error(
        `No matching order found (${direction} ${amount} / ${side})`,
      );
    }

    const bestPrice =
      side == 'Buy'
        ? Math.min(...availablePrices)
        : Math.max(...availablePrices);
    const getExpectedAmount = () => {
      switch (side + direction) {
        case 'BuySend':
        case 'SellReceive':
          return amount / bestPrice;
        default:
          return amount * bestPrice;
      }
    };
    return {
      price: bestPrice,
      amountSent: direction == 'Send' ? amount : getExpectedAmount(),
      amountReceived: direction == 'Receive' ? amount : getExpectedAmount(),
    };
  }

  /**
   * Split Atomex trading pair to base and quote currencies
   *
   * @param symbol Atomex trading pair {baseCurrency}/{quoteCurrency}
   */
  splitSymbol(symbol: string): [baseCurrency: string, quoteCurrency: string] {
    const [baseCurrency, quoteCurrency] = symbol.split('/', 2);
    if (!baseCurrency || !quoteCurrency)
      throw new Error('Symbol is invalid');

    return [baseCurrency, quoteCurrency];
  }

  /**
   * Get currency & network specific configuration
   *
   * @param currency L1/L2 token symbol (uppercase)
   */
  getCurrencyConfig(currency: string): CurrencyConfig {
    const currencyEntry = Object.entries(config.currencies).find(
      ([k, _v]) => k == currency,
    );
    if (currencyEntry == undefined) {
      throw new Error(`No matching config section for ${currency}`);
    }
    return {
      blockchain: currencyEntry[1].blockchain,
      decimals: currencyEntry[1].decimals.original,
      displayDecimals: currencyEntry[1].decimals.displayed,
      contractAddress: currencyEntry[1].contracts[this._network].address,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tokenAddress: (currencyEntry[1].contracts[this._network] as any).tokenAddress
    };
  }

  /**
   * Formatting an amount based on currency
   *
   * @param amount Amount received / sent
   * @param currency L1/L2 token symbol (uppercase)
   */
  formatAmount(amount: number | string, currency: string): number {
    const cfg = this.getCurrencyConfig(currency);
    return typeof amount === 'string'
      ? parseFloat(parseFloat(amount).toFixed(cfg.displayDecimals))
      : parseFloat(amount.toFixed(cfg.displayDecimals));
  }

  /**
   * Get order side for a particular trading pair given the bridge direction
   *
   * @param symbol Atomex trading pair {baseCurrency}/{quoteCurrency}
   * @param fromCurrency Currency to send
   * @param toCurrency Currency to receive
   */
  getOrderSide(
    symbol: string,
    fromCurrency: string,
    toCurrency: string,
  ): Side {
    const [baseCurrency, quoteCurrency] = this.splitSymbol(symbol);

    if (baseCurrency === fromCurrency && quoteCurrency === toCurrency)
      return 'Sell';

    if (quoteCurrency === fromCurrency && baseCurrency === toCurrency)
      return 'Buy';

    throw new Error(`Mismatch ${fromCurrency} => ${toCurrency} (${symbol})`);
  }

  /**
   * Get maximum available liquidity
   *
   * @param orderBook order-book received from [[getOrderBook]]
   * @param side order side Buy/Sell
   */
  getMaxOrderSize(orderBook: OrderBook, side: Side): number {
    return Math.max(
      ...orderBook.entries
        .filter(entry => entry.side != side)
        .map(entry => Math.max(...entry.qtyProfile)),
    );
  }
}
