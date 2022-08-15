import { InMemoryOrderBookProvider } from '../../src/exchange/index';
import { AtomexNetwork, DataSource, ExchangeManager } from '../../src/index';
import { TestAtomexClient, TestExchangeSymbolsProvider } from '../testHelpers/index';
import { validGetOrderPreviewTestCases, validGetSymbolsTestCases } from './testCases/index';

describe('Exchange Manager', () => {
  let atomexNetwork: AtomexNetwork;
  let exchangeManager: ExchangeManager;
  let testExchangeService: TestAtomexClient;
  let exchangeSymbolsProvider: TestExchangeSymbolsProvider;

  beforeEach(() => {
    testExchangeService = new TestAtomexClient(atomexNetwork);
    exchangeSymbolsProvider = new TestExchangeSymbolsProvider();
    exchangeManager = new ExchangeManager({
      exchangeService: testExchangeService,
      symbolsProvider: exchangeSymbolsProvider,
      orderBookProvider: new InMemoryOrderBookProvider
    });
  });

  afterEach(() => {
    exchangeManager.stop();
    testExchangeService.resetAllMocks();
  });

  test.each(validGetSymbolsTestCases)('get symbols with the default source: %s', async (_, symbolsUpdates) => {
    symbolsUpdates.forEach(update => testExchangeService.getSymbols.mockResolvedValueOnce(update));

    for (let i = 0; i < 1; i++) {
      // eslint-disable-next-line no-await-in-loop
      const symbols = await exchangeManager.getSymbols();
      expect(symbols).toEqual(symbolsUpdates[0]);
    }

    expect(testExchangeService.getSymbols).toHaveBeenCalledTimes(1);
  });

  test.each(validGetSymbolsTestCases)('get symbols with the remote source: %s', async (_, symbolsUpdates) => {
    symbolsUpdates.forEach(update => testExchangeService.getSymbols.mockResolvedValueOnce(update));

    for (let i = 0; i < symbolsUpdates.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const symbols = await exchangeManager.getSymbols(DataSource.Remote);
      expect(symbols).toEqual(symbolsUpdates[i]);
    }

    expect(testExchangeService.getSymbols).toHaveBeenCalledTimes(symbolsUpdates.length);
  });

  test.each(validGetSymbolsTestCases)('get symbols with the local source: %s', async (_, symbolsUpdates) => {
    symbolsUpdates.forEach(_ => testExchangeService.getSymbols.mockRejectedValueOnce(new Error('Should not be called')));

    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line no-await-in-loop
      const symbols = await exchangeManager.getSymbols(DataSource.Local);
      expect(symbols).toEqual([]);
    }

    expect(testExchangeService.getSymbols).toHaveBeenCalledTimes(0);
  });

  test.each(validGetOrderPreviewTestCases)(
    'get order preview: %s [%p]',
    async (_, orderPreviewParameters, expectedOrderPreview, symbols, orderBook) => {
      testExchangeService.getSymbols.mockResolvedValueOnce(symbols);
      testExchangeService.getOrderBook.mockResolvedValueOnce(orderBook);
      await exchangeManager.start();

      const orderPreview = await exchangeManager.getOrderPreview(orderPreviewParameters);

      expect(orderPreview).toEqual(expectedOrderPreview);
      expect(testExchangeService.getSymbols).toHaveBeenCalledTimes(1);
      expect(testExchangeService.getOrderBook).toHaveBeenCalledTimes(1);
    }
  );
});
