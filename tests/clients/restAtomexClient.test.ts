import { FetchMock } from 'jest-fetch-mock';

import { AtomexNetwork, AuthToken, RestAtomexClient } from '../../src/index';
import { TestAuthorizationManager } from '../testHelpers/testAuthManager';
import { validAddOrderTestCases, validOrderBookCases, validOrderCases, validSwapCases, validSymbolsCases, validTopOfBookTestCases } from './testCases';

describe('Rest Atomex Client', () => {
  const fetchMock = fetch as FetchMock;

  const testApiUrl = 'https://test-api.com';
  const atomexNetwork: AtomexNetwork = 'testnet';
  const testAccountAddress = 'test-account-address';
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
      authorizationManager: new TestAuthorizationManager(address => {
        return address === testAccountAddress ? testAuthToken : undefined;
      })
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

  describe('getOrder', () => {
    test.each(validOrderCases)('returns correct data (%s)', async (_, [responseDto, expectedOrder]) => {
      fetchMock.mockResponseOnce(JSON.stringify(responseDto));

      const order = await client.getOrder(testAccountAddress, 123);
      expect(order).not.toBeNull();
      expect(order).not.toBeUndefined();
      expect(order).toEqual(expectedOrder);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders/123`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });
  });

  describe('getOrders', () => {
    test.each(validOrderCases)('returns correct data (%s)', async (_, [responseDto, expectedOrder]) => {
      fetchMock.mockResponseOnce(JSON.stringify([responseDto]));

      const order = await client.getOrders(testAccountAddress);
      expect(order).not.toBeNull();
      expect(order).not.toBeUndefined();
      expect(order).toEqual([expectedOrder]);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([true, false])('passes the active filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getOrders(testAccountAddress, { active: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders?active=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([[true, 'Asc'], [false, 'Desc']])('passes the sortAsc filter (%s) to search params', async (filterValue, expectedQueryValue) => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getOrders(testAccountAddress, { sortAsc: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders?sort=${expectedQueryValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([0, 100])('passes the limit filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getOrders(testAccountAddress, { limit: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders?limit=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([2, 150])('passes the offset filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getOrders(testAccountAddress, { offset: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders?offset=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test('passes the symbols filter to search params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getOrders(testAccountAddress, { symbols: 'ETH/BTC' });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders?symbols=${encodeURIComponent('ETH/BTC')}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test('passes all filter values to search params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getOrders(testAccountAddress, {
        active: true,
        limit: 10,
        offset: 20,
        symbols: 'ETH/BTC',
        sortAsc: true
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders?active=true&limit=10&offset=20&symbols=${encodeURIComponent('ETH/BTC')}&sort=Asc`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });
  });

  describe('addOrder', () => {
    test.each(validAddOrderTestCases)('passes and returns correct data (%s)', async (_, [requestData, symbolsDto, createOrderDto, expectedPayload, expectedOrderId]) => {
      fetchMock.mockResponses(
        [JSON.stringify(symbolsDto), {}],
        [JSON.stringify(createOrderDto), {}],
      );

      const orderId = await client.addOrder(testAccountAddress, requestData);

      expect(orderId).toEqual(expectedOrderId);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenLastCalledWith(
        `${testApiUrl}/v1/Orders`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${testAuthToken.value}`,
            'Content-Type': 'application/json'
          },
          body: expect.anything()
        }
      );

      expect(JSON.parse(fetchMock.mock.calls[1]![1]!.body as string)).toEqual(expectedPayload);
    });
  });

  describe('cancelOrder', () => {
    test('passes and returns correct data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(true));

      const isSuccess = await client.cancelOrder(testAccountAddress, {
        orderId: 1,
        symbol: 'XTZ/ETH',
        side: 'Buy'
      });

      expect(isSuccess).toBe(true);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders/1?symbol=${encodeURIComponent('XTZ/ETH')}&side=Buy`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });
  });

  describe('cancelAllOrders', () => {
    test('passes and returns correct data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(2));

      const canceledOrdersCount = await client.cancelAllOrders(testAccountAddress, {
        symbol: 'XTZ/ETH',
        side: 'Buy',
        forAllConnections: true
      });

      expect(canceledOrdersCount).toBe(2);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Orders?symbol=${encodeURIComponent('XTZ/ETH')}&side=Buy&forAllConnections=true`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });
  });

  describe('getSwap', () => {
    test.each(validSwapCases)('returns correct data (%s)', async (_, [responseDto, expectedSwap]) => {
      fetchMock.mockResponseOnce(JSON.stringify(responseDto));

      const swap = await client.getSwap(testAccountAddress, 123);
      expect(swap).not.toBeNull();
      expect(swap).not.toBeUndefined();
      expect(swap).toEqual(expectedSwap);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps/123`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });
  });

  describe('getSwaps', () => {
    test.each(validSwapCases)('returns correct data (%s)', async (_, [responseDto, expectedSwap]) => {
      fetchMock.mockResponseOnce(JSON.stringify([responseDto]));

      const swap = await client.getSwaps(testAccountAddress,);
      expect(swap).not.toBeNull();
      expect(swap).not.toBeUndefined();
      expect(swap).toEqual([expectedSwap]);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([true, false])('passes the active filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { active: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?active=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([[true, 'Asc'], [false, 'Desc']])('passes the sortAsc filter (%s) to search params', async (filterValue, expectedQueryValue) => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { sortAsc: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?sort=${expectedQueryValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([0, 100])('passes the limit filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { limit: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?limit=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([2, 150])('passes the offset filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { offset: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?offset=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test('passes the symbols filter to search params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { symbols: 'ETH/BTC' });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?symbols=${encodeURIComponent('ETH/BTC')}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test('passes the symbols filter to search params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { symbols: 'ETH/BTC' });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?symbols=${encodeURIComponent('ETH/BTC')}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([true, false])('passes the completed filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { completed: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?completed=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test.each([3, 4322])('passes the offset filter (%s) to search params', async filterValue => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, { afterId: filterValue });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?afterId=${filterValue}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });

    test('passes all filter values to search params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getSwaps(testAccountAddress, {
        active: true,
        afterId: 3,
        completed: true,
        limit: 10,
        offset: 20,
        symbols: 'ETH/BTC',
        sortAsc: true,
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${testApiUrl}/v1/Swaps?active=true&afterId=3&completed=true&limit=10&offset=20&symbols=${encodeURIComponent('ETH/BTC')}&sort=Asc`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${testAuthToken.value}` }
        }
      );
    });
  });
});
