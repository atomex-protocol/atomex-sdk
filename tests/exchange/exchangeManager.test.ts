import { AtomexNetwork, DataSource, ExchangeManager } from '../../src/index';
import { MockAtomexClient, MockAuthorizationManager, MockAuthorizationManagerStore, MockExchangeSymbolsProvider, MockOrderBookProvider, MockWalletsManager } from '../mocks';
import { validGetAvailableLiquidityTestCases, validGetOrderPreviewTestCases, validGetSymbolsTestCases } from './testCases/index';

describe('Exchange Manager', () => {
  const atomexNetwork: AtomexNetwork = 'testnet';
  let exchangeService: MockAtomexClient;
  let authorizationManager: MockAuthorizationManager;
  let exchangeSymbolsProvider: MockExchangeSymbolsProvider;
  let orderBookProvider: MockOrderBookProvider;
  let exchangeManager: ExchangeManager;

  beforeEach(() => {
    authorizationManager = new MockAuthorizationManager({
      atomexNetwork,
      walletsManager: new MockWalletsManager(atomexNetwork),
      authorizationBaseUrl: 'https://atomex.authorization.url',
      store: new MockAuthorizationManagerStore()
    });
    exchangeService = new MockAtomexClient(atomexNetwork);
    exchangeSymbolsProvider = new MockExchangeSymbolsProvider();
    orderBookProvider = new MockOrderBookProvider();
    exchangeManager = new ExchangeManager({
      authorizationManager,
      exchangeService,
      symbolsProvider: exchangeSymbolsProvider,
      orderBookProvider
    });
  });

  afterEach(() => {
    exchangeManager.stop();
  });

  test.each(validGetSymbolsTestCases)('get symbols with the default source: %s', async (_, symbolsUpdates) => {
    symbolsUpdates.forEach(update => exchangeService.getSymbols.mockResolvedValueOnce(update));

    for (let i = 0; i < 1; i++) {
      // eslint-disable-next-line no-await-in-loop
      const symbols = await exchangeManager.getSymbols();
      expect(symbols).toEqual(symbolsUpdates[0]);
    }

    expect(exchangeService.getSymbols).toHaveBeenCalledTimes(1);
  });

  test.each(validGetSymbolsTestCases)('get symbols with the remote source: %s', async (_, symbolsUpdates) => {
    symbolsUpdates.forEach(update => exchangeService.getSymbols.mockResolvedValueOnce(update));

    for (let i = 0; i < symbolsUpdates.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const symbols = await exchangeManager.getSymbols(DataSource.Remote);
      expect(symbols).toEqual(symbolsUpdates[i]);
    }

    expect(exchangeService.getSymbols).toHaveBeenCalledTimes(symbolsUpdates.length);
  });

  test.each(validGetSymbolsTestCases)('get symbols with the local source: %s', async (_, symbolsUpdates) => {
    symbolsUpdates.forEach(_ => exchangeService.getSymbols.mockRejectedValueOnce(new Error('Should not be called')));

    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line no-await-in-loop
      const symbols = await exchangeManager.getSymbols(DataSource.Local);
      expect(symbols).toEqual([]);
    }

    expect(exchangeService.getSymbols).toHaveBeenCalledTimes(0);
  });

  test.each(validGetOrderPreviewTestCases)(
    'get order preview: %s [%p]',
    async (_, orderPreviewParameters, expectedOrderPreview, symbols, orderBook) => {
      exchangeService.getSymbols.mockResolvedValueOnce(symbols);
      exchangeService.getOrderBook.mockResolvedValueOnce(orderBook);
      await exchangeManager.start();

      const orderPreview = await exchangeManager.getOrderPreview(orderPreviewParameters);

      expect(orderPreview).toEqual(expectedOrderPreview);
      expect(exchangeService.getSymbols).toHaveBeenCalledTimes(1);
      expect(exchangeService.getOrderBook).toHaveBeenCalledTimes(1);
    }
  );

  test.each(validGetAvailableLiquidityTestCases)(
    'get available liquidity: %s [%p]',
    async (_, availableLiquidityParameters, expectedLiquidity, symbols, orderBook) => {
      exchangeService.getSymbols.mockResolvedValueOnce(symbols);
      exchangeService.getOrderBook.mockResolvedValueOnce(orderBook);
      await exchangeManager.start();

      const liquidity = await exchangeManager.getAvailableLiquidity(availableLiquidityParameters);

      expect(liquidity).toEqual(expectedLiquidity);
      expect(exchangeService.getSymbols).toHaveBeenCalledTimes(1);
      expect(exchangeService.getOrderBook).toHaveBeenCalledTimes(1);
    }
  );
});
