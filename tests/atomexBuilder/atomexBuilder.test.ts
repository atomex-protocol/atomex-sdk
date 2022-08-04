import WS from 'jest-websocket-mock';

import { AtomexBuilder } from '../../src/atomexBuilder/atomexBuilder';

describe('Atomex Builder', () => {
  const mainnetApiUrl = 'wss://ws.api.atomex.me';
  const testnetApiUrl = 'wss://ws.api.test.atomex.me';

  const createMarketDataWebServer = (baseUrl: string) => {
    new WS(
      new URL('/ws/marketdata', baseUrl).toString(),
      { jsonProtocol: true }
    );
  };

  beforeEach(() => {
    createMarketDataWebServer(mainnetApiUrl);
    createMarketDataWebServer(testnetApiUrl);
  });

  afterEach(() => {
    WS.clean();
  });

  test('creates default atomex instance', async () => {
    const mainnetAtomex = new AtomexBuilder({ atomexNetwork: 'mainnet' }).build();
    const testnetAtomex = new AtomexBuilder({ atomexNetwork: 'testnet' }).build();

    expect(mainnetAtomex).toBeDefined();
    expect(testnetAtomex).toBeDefined();

    mainnetAtomex.dispose();
    testnetAtomex.dispose();
  });
});
