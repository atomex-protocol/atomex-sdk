import BigNumber from 'bignumber.js';
import WS from 'jest-websocket-mock';

import type { AuthToken } from '../../src/authorization/index';
import { WebSocketAtomexClient } from '../../src/clients/index';
import type { AtomexNetwork } from '../../src/common/index';
import { InMemoryOrderBookProvider } from '../../src/exchange/index';
import { wait } from '../../src/utils/index';
import { MockExchangeSymbolsProvider } from '../mocks';
import { TestCurrenciesProvider, TestAuthorizationManager } from '../testHelpers/index';
import {
  validWsOrderBookSnapshotTestCases,
  validWsOrderBookUpdatedTestCases, validWsOrderUpdatedTestCases,
  validWsSwapUpdatedTestCases, validWsTopOfBookUpdatedTestCases
} from './testCases/index';

describe('WebSocket Atomex Client', () => {
  const testApiUrl = 'ws://test-api.com';
  const atomexNetwork: AtomexNetwork = 'testnet';
  const testAccountAddress = 'test-account-address';
  const testAuthToken: AuthToken = {
    address: 'address',
    expired: new Date(),
    userId: 'user-id',
    value: 'test-auth-token',
    request: {
      algorithm: 'test-algorithm',
      message: 'signing',
      publicKey: 'test-public-key',
      signature: 'test-signature',
      timeStamp: 1
    }
  };

  let exchangeWsServer: WS;
  let marketDataWsServer: WS;
  let client: WebSocketAtomexClient;
  let authorizationManager: TestAuthorizationManager;
  let exchangeSymbolsProvider: MockExchangeSymbolsProvider;

  const exchangeWsServerSelectProtocol = (protocols: string[]) => {
    const [tokenProtocolKey, tokenProtocolValue] = protocols;
    if (tokenProtocolKey !== 'access_token' || !tokenProtocolValue)
      throw new Error('Invalid protocols');

    return tokenProtocolKey;
  };

  const createExchangeWebServer = () => {
    exchangeWsServer = new WS(
      new URL('/ws/exchange', testApiUrl).toString(),
      {
        selectProtocol: exchangeWsServerSelectProtocol,
        jsonProtocol: true
      }
    );
  };

  const createMarketDataWebServer = () => {
    marketDataWsServer = new WS(
      new URL('/ws/marketdata', testApiUrl).toString(),
      { jsonProtocol: true }
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

  beforeEach(async () => {
    createExchangeWebServer();
    createMarketDataWebServer();

    authorizationManager = new TestAuthorizationManager(address => {
      return address === testAccountAddress ? testAuthToken : undefined;
    });

    exchangeSymbolsProvider = new MockExchangeSymbolsProvider();
    exchangeSymbolsProvider.setSymbols([
      {
        name: 'ETH/BTC',
        baseCurrency: 'ETH',
        quoteCurrency: 'BTC',
        minimumQty: new BigNumber(0.001),
        decimals: {
          baseCurrency: 9,
          quoteCurrency: 8,
          price: 9
        }
      },
      {
        name: 'XTZ/ETH',
        baseCurrency: 'XTZ',
        quoteCurrency: 'ETH',
        minimumQty: new BigNumber(1),
        decimals: {
          baseCurrency: 6,
          quoteCurrency: 9,
          price: 9
        }
      }
    ]);

    client = new WebSocketAtomexClient({
      webSocketApiBaseUrl: testApiUrl,
      atomexNetwork,
      authorizationManager,
      currenciesProvider: new TestCurrenciesProvider(),
      orderBookProvider: new InMemoryOrderBookProvider(),
      exchangeSymbolsProvider
    });

    await client.start();
  });

  afterEach(() => {
    client.stop();
    WS.clean();
  });

  test.each(validWsOrderUpdatedTestCases)('emits orderUpdated event with correct data (%s)', async (_, [responseDto, expectedOrder]) => {
    const onOrderUpdatedCallback = jest.fn();
    const onSwapUpdatedCallback = jest.fn();
    const onTopOfBookUpdatedCallback = jest.fn();
    const onOrderBookSnapshotCallback = jest.fn();
    const onOrderBookUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);
    client.events.swapUpdated.addListener(onSwapUpdatedCallback);
    client.events.topOfBookUpdated.addListener(onTopOfBookUpdatedCallback);
    client.events.orderBookSnapshot.addListener(onOrderBookSnapshotCallback);
    client.events.orderBookUpdated.addListener(onOrderBookUpdatedCallback);
    authorizationManager.emitAuthorizedEvent(testAuthToken);
    await exchangeWsServer.connected;

    exchangeWsServer.send(responseDto);

    expect(onSwapUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onTopOfBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookSnapshotCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(1);
    expect(onOrderUpdatedCallback).toHaveBeenCalledWith(expectedOrder);
  });

  test.each(validWsSwapUpdatedTestCases)('emits swapUpdated event with correct data (%s)', async (_, [responseDto, expectedSwap]) => {
    const onOrderUpdatedCallback = jest.fn();
    const onSwapUpdatedCallback = jest.fn();
    const onTopOfBookUpdatedCallback = jest.fn();
    const onOrderBookSnapshotCallback = jest.fn();
    const onOrderBookUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);
    client.events.swapUpdated.addListener(onSwapUpdatedCallback);
    client.events.topOfBookUpdated.addListener(onTopOfBookUpdatedCallback);
    client.events.orderBookSnapshot.addListener(onOrderBookSnapshotCallback);
    client.events.orderBookUpdated.addListener(onOrderBookUpdatedCallback);
    authorizationManager.emitAuthorizedEvent(testAuthToken);

    await exchangeWsServer.connected;

    exchangeWsServer.send(responseDto);

    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onTopOfBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookSnapshotCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onSwapUpdatedCallback).toHaveBeenCalledTimes(1);
    expect(onSwapUpdatedCallback).toHaveBeenCalledWith(expectedSwap);
  });

  test.each(validWsTopOfBookUpdatedTestCases)('emits topOfBookUpdated event with correct data (%s)', async (_, [responseDto, expectedQuotes]) => {
    const onOrderUpdatedCallback = jest.fn();
    const onSwapUpdatedCallback = jest.fn();
    const onTopOfBookUpdatedCallback = jest.fn();
    const onOrderBookSnapshotCallback = jest.fn();
    const onOrderBookUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);
    client.events.swapUpdated.addListener(onSwapUpdatedCallback);
    client.events.topOfBookUpdated.addListener(onTopOfBookUpdatedCallback);
    client.events.orderBookSnapshot.addListener(onOrderBookSnapshotCallback);
    client.events.orderBookUpdated.addListener(onOrderBookUpdatedCallback);
    authorizationManager.emitAuthorizedEvent(testAuthToken);

    await exchangeWsServer.connected;

    exchangeWsServer.send(responseDto);

    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onSwapUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookSnapshotCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onTopOfBookUpdatedCallback).toHaveBeenCalledTimes(1);
    expect(onTopOfBookUpdatedCallback).toHaveBeenCalledWith(expectedQuotes);
  });

  test.each(validWsOrderBookSnapshotTestCases)('emits orderBookSnapshot event with correct data (%s)', async (_, [snapshotDtos, expectedOrderBooks]) => {
    const onOrderUpdatedCallback = jest.fn();
    const onSwapUpdatedCallback = jest.fn();
    const onTopOfBookUpdatedCallback = jest.fn();
    const onOrderBookSnapshotCallback = jest.fn();
    const onOrderBookUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);
    client.events.swapUpdated.addListener(onSwapUpdatedCallback);
    client.events.topOfBookUpdated.addListener(onTopOfBookUpdatedCallback);
    client.events.orderBookUpdated.addListener(onOrderBookUpdatedCallback);
    client.events.orderBookSnapshot.addListener(onOrderBookSnapshotCallback);
    authorizationManager.emitAuthorizedEvent(testAuthToken);

    await exchangeWsServer.connected;

    snapshotDtos.forEach(snapshot => exchangeWsServer.send(snapshot));

    expect(onSwapUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onTopOfBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookSnapshotCallback).toHaveBeenCalledTimes(snapshotDtos.length);
    for (let i = 0; i < expectedOrderBooks.length; i++) {
      expect(onOrderBookSnapshotCallback).toHaveBeenNthCalledWith(i + 1, expectedOrderBooks[i]);
    }
  });

  test.each(validWsOrderBookUpdatedTestCases)('emits orderBookUpdated event with correct data (%s)', async (_, [snapshotDtos, entryDtos, expectedOrderBooks]) => {
    const onOrderUpdatedCallback = jest.fn();
    const onSwapUpdatedCallback = jest.fn();
    const onTopOfBookUpdatedCallback = jest.fn();
    const onOrderBookSnapshotCallback = jest.fn();
    const onOrderBookUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);
    client.events.swapUpdated.addListener(onSwapUpdatedCallback);
    client.events.topOfBookUpdated.addListener(onTopOfBookUpdatedCallback);
    client.events.orderBookUpdated.addListener(onOrderBookUpdatedCallback);
    client.events.orderBookSnapshot.addListener(onOrderBookSnapshotCallback);
    authorizationManager.emitAuthorizedEvent(testAuthToken);

    await exchangeWsServer.connected;

    snapshotDtos.forEach(snapshot => exchangeWsServer.send(snapshot));
    entryDtos.forEach(entries => exchangeWsServer.send(entries));

    await wait(1500);

    expect(onSwapUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onTopOfBookUpdatedCallback).toHaveBeenCalledTimes(0);
    expect(onOrderBookSnapshotCallback).toHaveBeenCalledTimes(snapshotDtos.length);
    expect(onOrderBookUpdatedCallback).toHaveBeenCalledTimes(expectedOrderBooks.length);
    for (let i = 0; i < expectedOrderBooks.length; i++) {
      expect(onOrderBookUpdatedCallback).toHaveBeenNthCalledWith(i + 1, expectedOrderBooks[i]);
    }
  });

  test('creates connection for every unique user', async () => {
    let connectionsCount = 0;
    let disconnectionsCount = 0;

    exchangeWsServer.on('connection', () => connectionsCount++);
    exchangeWsServer.on('close', () => disconnectionsCount++);

    let connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address1',
      expired: new Date(),
      userId: 'user1',
      value: 'token1',
      request: {
        algorithm: 'test-algorithm',
        message: 'signing',
        publicKey: 'test-public-key1',
        signature: 'test-signature1',
        timeStamp: 1
      }
    });
    await connectPromise;

    connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address2',
      expired: new Date(),
      userId: 'user2',
      value: 'token2',
      request: {
        algorithm: 'test-algorithm',
        message: 'signing',
        publicKey: 'test-public-key2',
        signature: 'test-signature2',
        timeStamp: 1
      }
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
      value: 'token1',
      request: {
        algorithm: 'test-algorithm',
        message: 'signing',
        publicKey: 'test-public-key',
        signature: 'test-signature',
        timeStamp: 1
      }
    });
    await connectPromise;

    connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address1',
      expired: new Date(),
      userId: 'user1',
      value: 'token1Changed',
      request: {
        algorithm: 'test-algorithm',
        message: 'signing',
        publicKey: 'test-public-key',
        signature: 'test-signature',
        timeStamp: 1
      }
    });
    await connectPromise;

    expect(exchangeWsServer.server.clients().length).toBe(1);
    expect(connectionsCount).toBe(2);
    expect(disconnectionsCount).toBe(1);
  });

  test('does reconnect when exchange server closes connection', async () => {
    const [_message, [responseDto, expectedOrder]] = validWsOrderUpdatedTestCases[0]!;

    let connectionsCount = 0;
    exchangeWsServer.on('connection', () => connectionsCount++);

    const onOrderUpdatedCallback = jest.fn();
    client.events.orderUpdated.addListener(onOrderUpdatedCallback);

    let connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address1',
      expired: new Date(),
      userId: 'user1',
      value: 'token1',
      request: {
        algorithm: 'test-algorithm',
        message: 'signing',
        publicKey: 'test-public-key',
        signature: 'test-signature',
        timeStamp: 1
      }
    });
    await connectPromise;
    await exchangeWsServer.connected;

    exchangeWsServer.send(responseDto);

    //imitation of disconnect from ws server
    exchangeWsServer.close();
    createExchangeWebServer();
    connectPromise = getOnConnectPromise(exchangeWsServer);
    exchangeWsServer.on('connection', () => connectionsCount++);
    await connectPromise;

    exchangeWsServer.send(responseDto);

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

  test('closes active connections on stop', async () => {
    expect(marketDataWsServer.server.clients().length).toBe(1);
    expect(exchangeWsServer.server.clients().length).toBe(0);

    const connectPromise = getOnConnectPromise(exchangeWsServer);
    authorizationManager.emitAuthorizedEvent({
      address: 'address1',
      expired: new Date(),
      userId: 'user1',
      value: 'token1',
      request: {
        algorithm: 'test-algorithm',
        message: 'signing',
        publicKey: 'test-public-key',
        signature: 'test-signature',
        timeStamp: 1
      }
    });
    await connectPromise;

    expect(marketDataWsServer.server.clients().length).toBe(1);
    expect(exchangeWsServer.server.clients().length).toBe(1);


    const disconnectMarketDataPromise = getOnClosePromise(marketDataWsServer);
    const disconnectExchangePromise = getOnClosePromise(exchangeWsServer);

    client.stop();

    await Promise.all([disconnectMarketDataPromise, disconnectExchangePromise]);

    expect(marketDataWsServer.server.clients().length).toBe(0);
    expect(exchangeWsServer.server.clients().length).toBe(0);
  });

  test('creates market data connection with subscriptions on initialization', async () => {
    expect(marketDataWsServer.server.clients().length).toBe(1);

    const messages = [await marketDataWsServer.nextMessage, await marketDataWsServer.nextMessage];

    expect(messages).toContainEqual({
      method: 'subscribe',
      data: 'topOfBook',
      requestId: expect.anything()
    });

    expect(messages).toContainEqual({
      method: 'subscribe',
      data: 'orderBook',
      requestId: expect.anything()
    });
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

    const messages = [await marketDataWsServer.nextMessage, await marketDataWsServer.nextMessage];

    expect(messages).toContainEqual({
      method: 'subscribe',
      data: 'topOfBook',
      requestId: expect.anything()
    });

    expect(messages).toContainEqual({
      method: 'subscribe',
      data: 'orderBook',
      requestId: expect.anything()
    });
  });
});
