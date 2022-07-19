import { FetchMock } from 'jest-fetch-mock';

import { AuthorizationManager, RestAtomexClient } from '../../src/index';
import validQuotesTestCases from './testCases/validQuotesTestCases';

const fetchMock = fetch as FetchMock;

describe('Rest Atomex Client', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test.each(validQuotesTestCases)('returns TopOfBook: %s', async (_, [responseDtos, expectedQuotes]) => {
    fetchMock.mockResponseOnce(JSON.stringify(responseDtos));

    const testApiUrl = 'https://test-api.com';

    const client = new RestAtomexClient({
      apiBaseUrl: testApiUrl,
      atomexNetwork: 'testnet',
      authorizationManager: null as unknown as AuthorizationManager
    });

    const quotes = await client.getTopOfBook();
    expect(quotes).not.toBeNull();
    expect(quotes).not.toBeUndefined();
    expect(quotes.length).toBe(expectedQuotes.length);
    expect(quotes).toEqual(expectedQuotes);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${testApiUrl}/v1/MarketData/quotes`);
  });
});
