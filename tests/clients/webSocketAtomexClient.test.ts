import WS from 'jest-websocket-mock';

import type { AuthToken } from '../../src/authorization/index';
import { WebSocketAtomexClient } from '../../src/clients/index';
import type { AtomexNetwork } from '../../src/common/index';
import { TestAuthorizationManager } from '../testHelpers/testAuthManager';
import { validWsOrderTestCases, validWsSwapTestCases } from './testCases/index';

describe('WebSocket Atomex Client', () => {
  const testApiUrl = 'ws://test-api.com';
  const atomexNetwork: AtomexNetwork = 'testnet';
  const testAccountAddress = 'test-account-address';
  const testAuthToken: AuthToken = {
    address: 'address',
    expired: new Date(),
    userId: 'user-id',
    value: 'test-auth-token'
  };

  let exchangeWsServer: WS;
  let client: WebSocketAtomexClient;
  let authorizationManager: TestAuthorizationManager;

  beforeEach(() => {
    WS.clean();
    exchangeWsServer = new WS(new URL(WebSocketAtomexClient.EXCHANGE_URL_PATH, testApiUrl).toString(), {});

    authorizationManager = new TestAuthorizationManager(address => {
      return address === testAccountAddress ? testAuthToken : undefined;
    });

    client = new WebSocketAtomexClient({
      webSocketApiBaseUrl: testApiUrl,
      atomexNetwork,
      authorizationManager,
    });
  });

  test.each(validWsOrderTestCases)('emits orderUpdated event with correct data (%s)', async (_, [responseDto, expectedOrder]) => {
    const onOrderUpdatedCallback = jest.fn();
    const onSwapUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);
    client.events.swapUpdated.addListener(onSwapUpdatedCallback);
    authorizationManager.emitAuthorizedEvent(testAuthToken);
    await exchangeWsServer.connected;

    exchangeWsServer.send(JSON.stringify(responseDto));

    expect(onSwapUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(1);
    expect(onOrderUpdatedCallback).toHaveBeenCalledWith(expectedOrder);
  });

  test.each(validWsSwapTestCases)('emits swapUpdated event with correct data (%s)', async (_, [responseDto, expectedSwap]) => {
    const onOrderUpdatedCallback = jest.fn();
    const onSwapUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);
    client.events.swapUpdated.addListener(onSwapUpdatedCallback);
    authorizationManager.emitAuthorizedEvent(testAuthToken);

    await exchangeWsServer.connected;

    exchangeWsServer.send(JSON.stringify(responseDto));

    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onSwapUpdatedCallback).toHaveBeenCalledTimes(1);
    expect(onSwapUpdatedCallback).toHaveBeenCalledWith(expectedSwap);
  });
});
