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
  let marketDataWsServer: WS;
  let client: WebSocketAtomexClient;
  let authorizationManager: TestAuthorizationManager;

  const exchangeWsServerSelectProtocol = (protocols: string[]) => {
    const [tokenProtocolKey, tokenProtocolValue] = protocols;
    if (tokenProtocolKey !== 'access_token' || !tokenProtocolValue)
      throw new Error('Invalid protocols');

    return tokenProtocolKey;
  };

  const createExchangeWebServer = () => {
    exchangeWsServer = new WS(
      new URL(WebSocketAtomexClient.EXCHANGE_URL_PATH, testApiUrl).toString(),
      { selectProtocol: exchangeWsServerSelectProtocol }
    );
  };

  const createMarketDataWebServer = () => {
    marketDataWsServer = new WS(
      new URL(WebSocketAtomexClient.MARKET_DATA_URL_PATH, testApiUrl).toString(),
    );
  };

  const getOnConnectPromise = (server: WS) => {
    return new Promise<void>(resolve => {
      server.server.on('connection', () => resolve());
    });
  };

  const getOnClosePromise = (server: WS) => {
    return new Promise<void>(resolve => {
      server.server.on('close', () => resolve());
    });
  };

  beforeEach(() => {
    createExchangeWebServer();
    createMarketDataWebServer();

    authorizationManager = new TestAuthorizationManager(address => {
      return address === testAccountAddress ? testAuthToken : undefined;
    });

    client = new WebSocketAtomexClient({
      webSocketApiBaseUrl: testApiUrl,
      atomexNetwork,
      authorizationManager,
    });
  });

  afterEach(() => {
    client.dispose();
    WS.clean();
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

  test('creates connection for every unique user', async () => {
    let connectionsCount = 0;
    let disconnectionsCount = 0;

    exchangeWsServer.on('connection', () => connectionsCount++);
    exchangeWsServer.on('close', () => disconnectionsCount++);

    let connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address2',
      expired: new Date(),
      userId: 'user1',
      value: 'token1'
    });
    await connectPromise;

    connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address2',
      expired: new Date(),
      userId: 'user2',
      value: 'token2'
    });
    await connectPromise;

    expect(exchangeWsServer.server.clients().length).toBe(2);
    expect(connectionsCount).toBe(2);
    expect(disconnectionsCount).toBe(0);
  });

  test('creates single connection for a certain user', async () => {
    let connectionsCount = 0;
    let disconnectionsCount = 0;

    exchangeWsServer.on('connection', () => connectionsCount++);
    exchangeWsServer.on('close', () => disconnectionsCount++);

    let connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address2',
      expired: new Date(),
      userId: 'user1',
      value: 'token1'
    });
    await connectPromise;

    connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address1',
      expired: new Date(),
      userId: 'user1',
      value: 'token1Changed'
    });
    await connectPromise;

    expect(exchangeWsServer.server.clients().length).toBe(1);
    expect(connectionsCount).toBe(2);
    expect(disconnectionsCount).toBe(1);
  });

  test('does reconnect when exchange server closes connection', async () => {
    const [_message, [responseDto, expectedOrder]] = validWsOrderTestCases[0]!;

    let connectionsCount = 0;
    exchangeWsServer.on('connection', () => connectionsCount++);

    const onOrderUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);

    let connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address2',
      expired: new Date(),
      userId: 'user1',
      value: 'token1'
    });
    await connectPromise;
    await exchangeWsServer.connected;

    exchangeWsServer.send(JSON.stringify(responseDto));

    //imitation of disconnect from ws server
    exchangeWsServer.close();
    createExchangeWebServer();
    connectPromise = getOnConnectPromise(exchangeWsServer);
    exchangeWsServer.on('connection', () => connectionsCount++);
    await connectPromise;

    exchangeWsServer.send(JSON.stringify(responseDto));

    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(2);
    expect(onOrderUpdatedCallback).toHaveBeenNthCalledWith(1, expectedOrder);
    expect(onOrderUpdatedCallback).toHaveBeenNthCalledWith(2, expectedOrder);
    expect(exchangeWsServer.server.clients().length).toBe(1);
    expect(connectionsCount).toBe(2);
  });

  test('creates connection on authorize and closes connection on unauthorize', async () => {
    let connectionsCount = 0;
    let disconnectionsCount = 0;

    exchangeWsServer.on('connection', () => connectionsCount++);
    exchangeWsServer.on('close', () => disconnectionsCount++);

    const connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent(testAuthToken);
    await connectPromise;

    expect(exchangeWsServer.server.clients().length).toBe(1);
    expect(connectionsCount).toBe(1);
    expect(disconnectionsCount).toBe(0);

    const closePromise = getOnClosePromise(exchangeWsServer);
    authorizationManager.emitUnauthorizedEvent(testAuthToken);
    await closePromise;

    expect(exchangeWsServer.server.clients().length).toBe(0);
    expect(connectionsCount).toBe(1);
    expect(disconnectionsCount).toBe(1);
  });

  test('creates market data connection on initialization', async () => {
    expect(marketDataWsServer.server.clients().length).toBe(1);
  });

  test('does reconnect when market data server closes connection', async () => {
    let connectionsCount = 0;

    //imitation of disconnect from ws server
    marketDataWsServer.close();
    createMarketDataWebServer();
    const connectPromise = getOnConnectPromise(marketDataWsServer);
    marketDataWsServer.on('connection', () => connectionsCount++);
    await connectPromise;

    expect(marketDataWsServer.server.clients().length).toBe(1);
    expect(connectionsCount).toBe(1);
  });
});
