import type { FetchMock } from 'jest-fetch-mock';
import WS from 'jest-websocket-mock';

import { AtomexBuilder } from '../../src/atomexBuilder/atomexBuilder';
import type { ExchangeSymbol } from '../../src/exchange/index';

describe('Atomex Builder', () => {
  const fetchMock = fetch as FetchMock;
  const mainnetApiUrl = 'wss://ws.api.atomex.me';
  const testnetApiUrl = 'wss://ws.api.test.atomex.me';
  const exchangeSymbols: readonly ExchangeSymbol[] = [];

  let mainnetMarketDataWebServer: WS;
  let testnetMarketDataWebServer: WS;

  const createMarketDataWebServer = (baseUrl: string) => {
    return new WS(
      new URL('/ws/marketdata', baseUrl).toString(),
      { jsonProtocol: true }
    );
  };

  beforeEach(() => {
    fetchMock.mockOnce(JSON.stringify(exchangeSymbols));

    mainnetMarketDataWebServer = createMarketDataWebServer(mainnetApiUrl);
    testnetMarketDataWebServer = createMarketDataWebServer(testnetApiUrl);
  });

  afterEach(() => {
    fetchMock.resetMocks();
    WS.clean();
  });

  test('creates default atomex instance in mainnet', async () => {
    const mainnetAtomex = new AtomexBuilder({ atomexNetwork: 'mainnet' }).build();
    await mainnetAtomex.start();
    await mainnetMarketDataWebServer.connected;

    expect(mainnetAtomex).toBeDefined();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(mainnetMarketDataWebServer.server.clients().length).toBe(1);

    mainnetAtomex.stop();
  });

  test('creates default atomex instance in testnet', async () => {
    const testnetAtomex = new AtomexBuilder({ atomexNetwork: 'testnet' }).build();
    await testnetAtomex.start();
    await testnetMarketDataWebServer.connected;

    expect(testnetAtomex).toBeDefined();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(testnetMarketDataWebServer.server.clients().length).toBe(1);

    testnetAtomex.stop();
  });
});
