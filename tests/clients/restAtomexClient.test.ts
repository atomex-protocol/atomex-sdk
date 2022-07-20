import { FetchMock } from 'jest-fetch-mock';

import { AuthorizationManager, RestAtomexClient } from '../../src/index';
import validTopOfBookTestCases from './testCases/validTopOfBookTestCases';

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

  test.each(validTopOfBookTestCases)('returns TopOfBook: %s', async (_, [responseDtos, expectedQuotes]) => {
    fetchMock.mockResponseOnce(JSON.stringify(responseDtos));

    const quotes = await client.getTopOfBook();
    expect(quotes).not.toBeNull();
    expect(quotes).not.toBeUndefined();
    expect(quotes.length).toBe(expectedQuotes.length);
    expect(quotes).toEqual(expectedQuotes);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/MarketData/quotes`);
  });

  test.each(validTopOfBookTestCases)('returns filtered TopOfBook: %s', async (_, [responseDtos, expectedQuotes]) => {
    fetchMock.mockResponseOnce(JSON.stringify(responseDtos));

    const quotes = await client.getTopOfBook(['ETH/BTC', 'XTZ/BTC']);
    expect(quotes).not.toBeNull();
    expect(quotes).not.toBeUndefined();
    expect(quotes.length).toBe(expectedQuotes.length);
    expect(quotes).toEqual(expectedQuotes);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/MarketData/quotes?symbols=${encodeURIComponent('ETH/BTC,XTZ/BTC')}`);
  });
});
