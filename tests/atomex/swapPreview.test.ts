/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';

import type { AtomexContext } from '../../src/atomex';
import { ethereumTestnetCurrencies } from '../../src/ethereum';
import { testnetEthereumWeb3AtomexProtocolV1Options } from '../../src/ethereum/config';
import { Atomex } from '../../src/index';
import { tezosTestnetCurrencies } from '../../src/tezos';
import { testnetTezosTaquitoAtomexProtocolV1Options } from '../../src/tezos/config/atomexProtocol';
import { createMockedAtomexContext, createMockedBlockchainOptions } from '../mocks';

describe('Atomex | Swap Preview', () => {
  const mockedAtomexContext = createMockedAtomexContext('mainnet');
  const mockedBlockchainOptions = {
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
  let atomex: Atomex;

  beforeEach(() => {
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

  test('Simple Swap Preview', async () => {
    mockedAtomexContext.services.exchangeService.getSymbols.mockResolvedValue([{
      name: 'XTZ/ETH',
      baseCurrency: 'ETH',
      quoteCurrency: 'XTZ',
      minimumQty: new BigNumber(0.0001),
      decimals: {
        baseCurrency: 9,
        quoteCurrency: 6,
        price: 9
      }
    }]);
    mockedAtomexContext.services.exchangeService.getOrderBook.mockResolvedValue({
      updateId: 23970,
      symbol: 'XTZ/ETH',
      baseCurrency: 'ETH',
      quoteCurrency: 'XTZ',
      entries: [
        {
          side: 'Buy',
          price: new BigNumber(0.000948468),
          qtyProfile: [
            300.0
          ]
        },
        {
          side: 'Sell',
          price: new BigNumber(0.000977739),
          qtyProfile: [
            900.0
          ]
        }
      ]
    });
    mockedAtomexContext.managers.exchangeManager.getAvailableLiquidity.mockResolvedValue({
      type: 'SolidFillOrKill',
      side: 'Sell',
      symbol: 'XTZ/ETH',
      from: {
        currencyId: 'XTZ',
        amount: new BigNumber('300.0'),
        price: new BigNumber('0.000948468')
      },
      to: {
        currencyId: 'ETH',
        amount: new BigNumber('0.2845404'),
        price: new BigNumber('1054.331827747')
      },
    });

    mockedBlockchainOptions.tezos.currencyOptions['XTZ']!.atomexProtocol.getInitiateFees
      .mockResolvedValue({ estimated: new BigNumber('0.0743'), max: new BigNumber('0.1') });
    mockedBlockchainOptions.tezos.currencyOptions['XTZ']!.atomexProtocol.getRedeemFees
      .mockResolvedValue({ estimated: new BigNumber('0.05'), max: new BigNumber('0.07') });
    mockedBlockchainOptions.tezos.currencyOptions['XTZ']!.atomexProtocol.getRefundFees
      .mockResolvedValue({ estimated: new BigNumber('0.05'), max: new BigNumber('0.07') });
    mockedBlockchainOptions.tezos.currencyOptions['XTZ']!.atomexProtocol.getRedeemReward
      .mockResolvedValue({ estimated: new BigNumber('2.240568'), max: new BigNumber('2.240568') });

    mockedBlockchainOptions.ethereum.currencyOptions['ETH']!.atomexProtocol.getInitiateFees
      .mockResolvedValue({ estimated: new BigNumber('0.00189'), max: new BigNumber('0.003') });
    mockedBlockchainOptions.ethereum.currencyOptions['ETH']!.atomexProtocol.getRedeemFees
      .mockResolvedValue({ estimated: new BigNumber('0.0015'), max: new BigNumber('0.0027') });
    mockedBlockchainOptions.ethereum.currencyOptions['ETH']!.atomexProtocol.getRefundFees
      .mockResolvedValue({ estimated: new BigNumber('0.0013'), max: new BigNumber('0.0027') });

    await atomex.exchangeManager.start();

    const swapPreview = await atomex.getSwapPreview({
      type: 'SolidFillOrKill',
      from: 'XTZ',
      to: 'ETH',
      amount: new BigNumber('10'),
    });
    console.log(swapPreview);
  });
});
