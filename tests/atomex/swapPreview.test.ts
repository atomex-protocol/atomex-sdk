/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';

import type { AtomexContext } from '../../src/atomex';
import { ethereumTestnetCurrencies } from '../../src/ethereum';
import { testnetEthereumWeb3AtomexProtocolV1Options } from '../../src/ethereum/config';
import { Atomex } from '../../src/index';
import { tezosTestnetCurrencies } from '../../src/tezos';
import { testnetTezosTaquitoAtomexProtocolV1Options } from '../../src/tezos/config/atomexProtocol';
import { createMockedAtomexContext, createMockedBlockchainOptions, MockAtomexBlockchainNetworkOptions, MockAtomexContext } from '../mocks';
import { Accounts, AtomexProtocolV1Fees, swapPreviewWithAccountTestCases, swapPreviewWithoutAccountTestCases } from './testCases';

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
        atomexProtocolOptions: testnetEthereumWeb3AtomexProtocolV1Options,
        toolkitId: 'web3'
      }),
      tezos: createMockedBlockchainOptions({
        currencies: tezosTestnetCurrencies,
        atomexProtocolOptions: testnetTezosTaquitoAtomexProtocolV1Options,
        toolkitId: 'taquito'
      }),
    };
    atomex = new Atomex({
      atomexContext: mockedAtomexContext as unknown as AtomexContext,
      managers: {
        authorizationManager: mockedAtomexContext.managers.authorizationManager,
        exchangeManager: mockedAtomexContext.managers.exchangeManager,
        swapManager: mockedAtomexContext.managers.swapManager,
        walletsManager: mockedAtomexContext.managers.walletsManager,
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
      mockAtomexProtocolV1Fees(environment.atomexProtocolFees);
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

      mockAccounts(environment.accounts);
      mockAtomexProtocolV1Fees(environment.atomexProtocolFees);
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

    for (const entry of Object.entries(accounts)) {
      const blockchain = entry[0] as keyof typeof accounts;
      const blockchainAccounts = entry[1] as Accounts[typeof blockchain];

      mockedBlockchainOptions[blockchain].balancesProvider.getBalance
        .mockImplementation((address, currency) => {
          return Promise.resolve(blockchainAccounts[address]?.[currency.id] || new BigNumber(0));
        });
    }
  };

  const mockAtomexProtocolV1Fees = (allFees: AtomexProtocolV1Fees) => {
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