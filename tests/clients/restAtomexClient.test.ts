import BigNumber from 'bignumber.js';
import { FetchMock } from 'jest-fetch-mock';

import { NewOrderRequest } from '../../src/exchange/index';
import { AtomexNetwork, AuthorizationManager, AuthToken, InMemoryAuthorizationManagerStore, InMemoryTezosSigner, RestAtomexClient, SignersManager } from '../../src/index';
import { TestAuthorizationManager } from '../testHelpers/testAuthManager';
import { validAddOrderTestCases, validOrderBookCases, validOrderCases, validSymbolsCases, validTopOfBookTestCases } from './testCases';

describe('Rest Atomex Client', () => {
  const fetchMock = fetch as FetchMock;

  const testApiUrl = 'https://test-api.com';
  const atomexNetwork: AtomexNetwork = 'testnet';
  const testAuthToken: AuthToken = {
    address: 'address',
    expired: new Date(),
    userId: 'user-id',
    value: 'test-auth-token'
  };

  let client: RestAtomexClient;

  beforeEach(() => {
    fetchMock.resetMocks();

    client = new RestAtomexClient({
      apiBaseUrl: testApiUrl,
      atomexNetwork,
      authorizationManager: new TestAuthorizationManager(testAuthToken)
    });
  });

  describe('getSymbols', () => {
    test.each(validSymbolsCases)('returns correct data (%s)', async (_, [responseDtos, expectedSymbols]) => {
      fetchMock.mockResponseOnce(JSON.stringify(responseDtos));

      const symbols = await client.getSymbols();
      expect(symbols).not.toBeNull();
      expect(symbols).not.toBeUndefined();
      expect(symbols.length).toBe(expectedSymbols.length);
      expect(symbols).toEqual(expectedSymbols);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Symbols`, expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('getTopOfBook', () => {
    test.each(validTopOfBookTestCases)('returns correct data (%s)', async (_, [responseDtos, expectedQuotes]) => {
      fetchMock.mockResponseOnce(JSON.stringify(responseDtos));

      const quotes = await client.getTopOfBook();
      expect(quotes).not.toBeNull();
      expect(quotes).not.toBeUndefined();
      expect(quotes.length).toBe(expectedQuotes.length);
      expect(quotes).toEqual(expectedQuotes);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/MarketData/quotes`, expect.objectContaining({ method: 'GET' }));
    });

    test('passes the symbols filter to search params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getTopOfBook(['ETH/BTC', 'XTZ/BTC']);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/MarketData/quotes?symbols=${encodeURIComponent('ETH/BTC,XTZ/BTC')}`,
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('getOrderBook', () => {
    test.each(validOrderBookCases)('returns correct data (%s)', async (_, [responseDto, expectedOrderBook]) => {
      fetchMock.mockResponseOnce(JSON.stringify(responseDto));

      const orderBook = await client.getOrderBook('ETH/BTC');
      expect(orderBook).not.toBeNull();
      expect(orderBook).not.toBeUndefined();
      expect(orderBook).toEqual(expectedOrderBook);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/MarketData/book?symbol=${encodeURIComponent('ETH/BTC')}`,
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('GetOrder', () => {
    test.each(validOrderCases)('returns correct data (%s)', async (_, [responseDto, expectedOrder]) => {
      fetchMock.mockResponseOnce(JSON.stringify(responseDto));

      const order = await client.getOrder(123);
      expect(order).not.toBeNull();
      expect(order).not.toBeUndefined();
      expect(order).toEqual(expectedOrder);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders/123`,
        expect.objectContaining({
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        })
      );
    });
  });

  describe('GetOrders', () => {
    test.each(validOrderCases)('returns correct data (%s)', async (_, [responseDto, expectedOrder]) => {
      fetchMock.mockResponseOnce(JSON.stringify([responseDto]));

      const order = await client.getOrders();
      expect(order).not.toBeNull();
      expect(order).not.toBeUndefined();
      expect(order).toEqual([expectedOrder]);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders`,
        expect.objectContaining({
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        })
      );
    });
  });

  test.each([true, false])('passes the active filter (%s) to search params', async filterValue => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ active: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${testApiUrl}/v1/Orders?active=${filterValue}`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${testAuthToken.value}` }
      })
    );
  });

  test.each([[true, 'Asc'], [false, 'Desc']])('passes the sortAsc filter (%s) to search params', async (filterValue, expectedQueryValue) => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ sortAsc: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${testApiUrl}/v1/Orders?sort=${expectedQueryValue}`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${testAuthToken.value}` }
      })
    );
  });

  test.each([0, 100])('passes the limit filter (%s) to search params', async filterValue => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ limit: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${testApiUrl}/v1/Orders?limit=${filterValue}`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${testAuthToken.value}` }
      })
    );
  });

  test.each([2, 150])('passes the offset filter (%s) to search params', async filterValue => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ offset: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${testApiUrl}/v1/Orders?offset=${filterValue}`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${testAuthToken.value}` }
      })
    );
  });

  test('passes the symbols filter to search params', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ symbols: 'ETH/BTC' });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${testApiUrl}/v1/Orders?symbols=${encodeURIComponent('ETH/BTC')}`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${testAuthToken.value}` }
      })
    );
  });

  test('passes all filter values to search params', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({
      active: true,
      limit: 10,
      offset: 20,
      symbols: 'ETH/BTC',
      sortAsc: true
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${testApiUrl}/v1/Orders?active=true&limit=10&offset=20&symbols=${encodeURIComponent('ETH/BTC')}&sort=Asc`,
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${testAuthToken.value}` }
      })
    );
  });

  describe('AddOrder', () => {
    test.each(validAddOrderTestCases)('passes and returns correct data (%s)', async (_, [responseDto, expectedOrderId]) => {
      fetchMock.mockResponseOnce(JSON.stringify(responseDto));

      const newOrderRequest: NewOrderRequest = {
        amount: new BigNumber(1),
        price: new BigNumber(2),
        from: 'ETH',
        to: 'XTZ',
        clientOrderId: 'client-order-id',
        side: 'Buy',
        type: 'FillOrKill'
      };

      const orderId = await client.addOrder(newOrderRequest);

      expect(orderId).toEqual(expectedOrderId);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${testAuthToken.value}`,
            'Content-Type': 'application/json'
          }),
          body: expect.anything()
        })
      );
    });
  });
});

