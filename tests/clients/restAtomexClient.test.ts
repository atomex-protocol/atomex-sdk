import { FetchMock } from 'jest-fetch-mock';

import { AuthorizationManager, RestAtomexClient } from '../../src/index';
import { validOrderBookCases, validOrderCases, validSymbolsCases, validTopOfBookTestCases } from './testCases';

describe('Rest Atomex Client', () => {
  const fetchMock = fetch as FetchMock;

  const testApiUrl = 'https://test-api.com';
  let client: RestAtomexClient;

  beforeEach(() => {
    fetchMock.resetMocks();

    client = new RestAtomexClient({
      apiBaseUrl: testApiUrl,
      atomexNetwork: 'testnet',
      authorizationManager: null as unknown as AuthorizationManager
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
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Symbols`);
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
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/MarketData/quotes`);
    });

    test('passes the symbols filter to search params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      await client.getTopOfBook(['ETH/BTC', 'XTZ/BTC']);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/MarketData/quotes?symbols=${encodeURIComponent('ETH/BTC,XTZ/BTC')}`);
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
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/MarketData/book?symbol=${encodeURIComponent('ETH/BTC')}`);
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
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders/123`);
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
      expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders`);
    });
  });

  test.each([true, false])('passes the active filter (%s) to search params', async filterValue => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ active: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders?active=${filterValue}`);
  });

  test.each([[true, 'Asc'], [false, 'Desc']])('passes the sortAsc filter (%s) to search params', async (filterValue, expectedQueryValue) => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ sortAsc: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders?sort=${expectedQueryValue}`);
  });

  test.each([0, 100])('passes the limit filter (%s) to search params', async filterValue => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ limit: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders?limit=${filterValue}`);
  });

  test.each([2, 150])('passes the offset filter (%s) to search params', async filterValue => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ offset: filterValue });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders?offset=${filterValue}`);
  });

  test('passes the symbols filter to search params', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    await client.getOrders({ symbols: 'ETH/BTC' });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders?symbols=${encodeURIComponent('ETH/BTC')}`);
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
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/Orders?active=true&limit=10&offset=20&symbols=${encodeURIComponent('ETH/BTC')}&sort=Asc`);
  });
});
