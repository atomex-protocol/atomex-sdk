/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';

import { ethereumTestnetCurrencies } from '../../src/ethereum';
import { testnetEthereumWeb3AtomexProtocolMultiChainOptions } from '../../src/ethereum/config';
import type { OrderBook } from '../../src/exchange';
import { Atomex } from '../../src/index';
import { tezosTestnetCurrencies } from '../../src/tezos';
import { testnetTezosTaquitoAtomexProtocolMultiChainOptions } from '../../src/tezos/config/atomexProtocol';
import { createMockedAtomexContext, createMockedBlockchainOptions, MockAtomexBlockchainNetworkOptions, MockAtomexContext } from '../mocks';
import { Accounts, AtomexProtocolMultiChainFees, swapPreviewWithAccountAndInvolvedSwapsTestCases, swapPreviewWithAccountTestCases, swapPreviewWithoutAccountTestCases } from './testCases';

describe('Atomex | Swap Preview', () => {
  let mockedAtomexContext: MockAtomexContext;
  let mockedBlockchainOptions: {
    ethereum: MockAtomexBlockchainNetworkOptions;
    tezos: MockAtomexBlockchainNetworkOptions;
  };
  let atomex: Atomex;

  beforeEach(() => {
    mockedAtomexContext = createMockedAtomexContext('mainnet');
    mockedBlockchainOptions = {
      ethereum: createMockedBlockchainOptions({
        currencies: ethereumTestnetCurrencies,
        atomexProtocolOptions: testnetEthereumWeb3AtomexProtocolMultiChainOptions,
        toolkitId: 'web3'
      }),
      tezos: createMockedBlockchainOptions({
        currencies: tezosTestnetCurrencies,
        atomexProtocolOptions: testnetTezosTaquitoAtomexProtocolMultiChainOptions,
        toolkitId: 'taquito'
      }),
    };
    atomex = new Atomex({
      atomexContext: mockedAtomexContext,
      managers: {
        authorizationManager: mockedAtomexContext.managers.authorizationManager,
        exchangeManager: mockedAtomexContext.managers.exchangeManager,
        swapManager: mockedAtomexContext.managers.swapManager,
        walletsManager: mockedAtomexContext.managers.walletsManager,
        balanceManager: mockedAtomexContext.managers.balanceManager,
        priceManager: mockedAtomexContext.managers.priceManager,
      },
      blockchains: mockedBlockchainOptions
    });
  });

  afterEach(() => {
    atomex.stop();
  });

  test.each(swapPreviewWithoutAccountTestCases)(
    'getting swap preview without account: %s\n\tSwap Preview Parameters: %j',
    async (_, swapPreviewParameters, expectedSwapPreview, environment) => {
      mockedAtomexContext.services.exchangeService.getSymbols.mockResolvedValue(environment.symbols);
      mockedAtomexContext.services.exchangeService.getOrderBook.mockImplementation(symbol => {
        if (typeof symbol === 'string')
          return Promise.resolve(environment.orderBooks.find(ob => ob.symbol === symbol));

        throw new Error('Expected symbol');
      });
      mockedAtomexContext.services.swapService.getSwaps.mockResolvedValue([]);
      mockPriceManagerByOrderBook(environment.orderBooks);
      mockAccounts({ ethereum: {}, tezos: {} });
      mockAtomexProtocolMultiChainFees(environment.atomexProtocolFees);
      await atomex.start();

      const swapPreview = await atomex.getSwapPreview(swapPreviewParameters);

      expect(swapPreview).toEqual(expectedSwapPreview);
    }
  );

  test.each(swapPreviewWithAccountTestCases)(
    'getting swap preview with account: %s\n\tSwap Preview Parameters: %j',
    async (_, swapPreviewParameters, expectedSwapPreview, environment) => {
      mockedAtomexContext.services.exchangeService.getSymbols.mockResolvedValue(environment.symbols);
      mockedAtomexContext.services.exchangeService.getOrderBook.mockImplementation(symbol => {
        if (typeof symbol === 'string')
          return Promise.resolve(environment.orderBooks.find(ob => ob.symbol === symbol));

        throw new Error('Expected symbol');
      });
      mockedAtomexContext.services.swapService.getSwaps.mockResolvedValue([]);
      mockPriceManagerByOrderBook(environment.orderBooks);
      mockAccounts(environment.accounts);
      mockAtomexProtocolMultiChainFees(environment.atomexProtocolFees);
      await atomex.start();

      const swapPreview = await atomex.getSwapPreview(swapPreviewParameters);

      expect(swapPreview).toEqual(expectedSwapPreview);
    }
  );

  test.each(swapPreviewWithAccountAndInvolvedSwapsTestCases)(
    'getting swap preview with account and involved swaps: %s\n\tSwap Preview Parameters: %j',
    async (_, swapPreviewParameters, expectedSwapPreview, environment) => {
      mockedAtomexContext.services.exchangeService.getSymbols.mockResolvedValue(environment.symbols);
      mockedAtomexContext.services.exchangeService.getOrderBook.mockImplementation(symbol => {
        if (typeof symbol === 'string')
          return Promise.resolve(environment.orderBooks.find(ob => ob.symbol === symbol));

        throw new Error('Expected symbol');
      });
      mockedAtomexContext.services.swapService.getSwaps.mockResolvedValue(environment.swaps);
      mockPriceManagerByOrderBook(environment.orderBooks);
      mockAccounts(environment.accounts);
      mockAtomexProtocolMultiChainFees(environment.atomexProtocolFees);
      await atomex.start();

      const swapPreview = await atomex.getSwapPreview(swapPreviewParameters);

      expect(swapPreview).toEqual(expectedSwapPreview);
    }
  );

  const getBlockchainNameByCurrencyId = (currencyId: string) => {
    switch (currencyId) {
      case 'ETH':
        return 'ethereum';
      case 'XTZ':
      case 'USDT_XTZ':
        return 'tezos';
      default:
        throw new Error(`Unknown ${currencyId} currency`);
    }
  };

  const mockAccounts = (accounts: Accounts) => {
    mockedAtomexContext.managers.walletsManager.getWalletMock.mockImplementation(
      (address, blockchain) => {
        if (!blockchain)
          return Promise.resolve(undefined);

        const blockchainAccount: Accounts[keyof Accounts] | undefined = accounts[blockchain as keyof Accounts];
        const wallet = address
          ? {
            getAddress: () => blockchainAccount[address] ? address : undefined,
            getBlockchain: () => blockchainAccount ? blockchain : undefined,
          }
          : {
            getAddress: () => blockchainAccount
              ? Object.entries(blockchainAccount)[0]?.[0]
              : undefined,
            getBlockchain: () => blockchainAccount ? blockchain : undefined,
          };

        return Promise.resolve(wallet as any);
      }
    );
    mockedAtomexContext.managers.authorizationManager.getAuthToken.mockImplementation(
      address => ({
        address,
        expired: new Date(Date.now() + 60 * 60 * 1000),
        userId: address,
        value: address,
        request: {
          algorithm: 'test-algorithm',
          message: 'test-message',
          publicKey: address,
          signature: `test-signature-${address}`,
          timeStamp: Date.now(),
        }
      })
    );

    mockedAtomexContext.managers.balanceManager.getBalance
      .mockImplementation((address, currency) => {
        return Promise.resolve(accounts[getBlockchainNameByCurrencyId(currency.id)][address]?.[currency.id] || new BigNumber(0));
      });
  };

  const mockPriceManagerByOrderBook = (orderBooks: OrderBook[]) => {
    const getMiddlePriceByOrderBook = (orderBook: OrderBook): BigNumber | undefined => {
      let buyPrice: BigNumber | undefined;
      let sellPrice: BigNumber | undefined;

      for (const entry of orderBook.entries) {
        if (entry.side === 'Buy') {
          buyPrice = entry.price;
          continue;
        }

        if (entry.side === 'Sell') {
          sellPrice = entry.price;
          break;
        }
      }

      return buyPrice && sellPrice
        ? buyPrice.plus(sellPrice).div(2)
        : undefined;
    };

    mockedAtomexContext.managers.priceManager.getPrice.mockImplementation(async params => {
      if (params.provider !== 'atomex')
        return undefined;

      const baseCurrencyId = typeof params.baseCurrency === 'string' ? params.baseCurrency : params.baseCurrency.id;
      const quoteCurrencyId = typeof params.quoteCurrency === 'string' ? params.quoteCurrency : params.quoteCurrency.id;

      for (const orderBook of orderBooks) {
        if (orderBook.baseCurrency === baseCurrencyId && orderBook.quoteCurrency === quoteCurrencyId)
          return getMiddlePriceByOrderBook(orderBook);
        else if (orderBook.baseCurrency === quoteCurrencyId && orderBook.quoteCurrency === baseCurrencyId)
          return getMiddlePriceByOrderBook(orderBook)?.pow(-1);
      }

      return undefined;
    });
  };

  const mockAtomexProtocolMultiChainFees = (allFees: AtomexProtocolMultiChainFees) => {
    for (const [currencyId, fees] of Object.entries(allFees)) {
      const blockchainId = getBlockchainNameByCurrencyId(currencyId);

      mockedBlockchainOptions[blockchainId].currencyOptions[currencyId]!.atomexProtocol.getInitiateFees
        .mockResolvedValue({ ...fees.initiateFees });
      mockedBlockchainOptions[blockchainId].currencyOptions[currencyId]!.atomexProtocol.getRedeemFees
        .mockResolvedValue({ ...fees.redeemFees });
      mockedBlockchainOptions[blockchainId].currencyOptions[currencyId]!.atomexProtocol.getRefundFees
        .mockResolvedValue({ ...fees.refundFees });
      mockedBlockchainOptions[blockchainId].currencyOptions[currencyId]!.atomexProtocol.getRedeemReward
        .mockResolvedValue({ ...fees.redeemReward });
    }
  };
});
