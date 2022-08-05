import WS from 'jest-websocket-mock';

import { AtomexBuilder } from '../../src/atomexBuilder/atomexBuilder';

describe('Atomex Builder', () => {
  const mainnetApiUrl = 'wss://ws.api.atomex.me';
  const testnetApiUrl = 'wss://ws.api.test.atomex.me';

  let mainnetMarketDataWebServer: WS;
  let testnetMarketDataWebServer: WS;

  const createMarketDataWebServer = (baseUrl: string) => {
    return new WS(
      new URL('/ws/marketdata', baseUrl).toString(),
      { jsonProtocol: true }
    );
  };

  beforeEach(() => {
    mainnetMarketDataWebServer = createMarketDataWebServer(mainnetApiUrl);
    testnetMarketDataWebServer = createMarketDataWebServer(testnetApiUrl);
  });

  afterEach(() => {
    WS.clean();
  });

  test('creates default atomex instance in mainnet', async () => {
    const mainnetAtomex = new AtomexBuilder({ atomexNetwork: 'mainnet' }).build();
    await mainnetMarketDataWebServer.connected;

    expect(mainnetAtomex).toBeDefined();
    expect(mainnetMarketDataWebServer.server.clients().length).toBe(1);

    mainnetAtomex.dispose();
  });

  test('creates default atomex instance in testnet', async () => {
    const testnetAtomex = new AtomexBuilder({ atomexNetwork: 'testnet' }).build();
    await testnetMarketDataWebServer.connected;

    expect(testnetAtomex).toBeDefined();
    expect(testnetMarketDataWebServer.server.clients().length).toBe(1);

    testnetAtomex.dispose();
  });
});
