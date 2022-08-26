import type BigNumber from 'bignumber.js';

import type { Currency } from '../../../src';
import type { AtomexProtocol, BalancesProvider, BlockchainToolkitProvider, CurrencyInfo, SwapTransactionsProvider } from '../../../src/blockchain';
import { atomexProtocolV1Helper } from '../../../src/blockchain/atomexProtocolV1/index';
import { MockBlockchainProvider, MockPriceManager } from '../../mocks';
import { redeemRewardNativeCurrencyTestCases, redeemRewardTokenTestCases } from './testCases';

describe('Atomex Protocol V1 utils', () => {

  const createPriceManager = (prices: Record<string, BigNumber>) => {
    const priceManager = new MockPriceManager();

    const getPriceImplementation = (baseCurrency: string, quoteCurrency: string) => {
      const symbol = `${baseCurrency}/${quoteCurrency}`;

      return prices[symbol];
    };

    priceManager.getPrice.mockImplementation(async ({ baseCurrency, quoteCurrency }) => {
      return getPriceImplementation(baseCurrency, quoteCurrency);
    });

    priceManager.getAveragePrice.mockImplementation(async ({ baseCurrency, quoteCurrency }) => {
      return getPriceImplementation(baseCurrency, quoteCurrency);
    });

    return priceManager;
  };

  const createBlockchainProvider = (currencies: Record<string, Currency>, nativeCurrencyId: string) => {
    const blockchainProvider = new MockBlockchainProvider();

    blockchainProvider.getCurrency.mockImplementation(currencyId => {
      return currencies[currencyId];
    });

    blockchainProvider.getNativeCurrencyInfo.mockImplementation(() => {
      const currency = currencies[nativeCurrencyId];

      return {
        currency,
        atomexProtocol: null as unknown as AtomexProtocol,
        balanceProvider: null as unknown as BalancesProvider,
        blockchainToolkitProvider: null as unknown as BlockchainToolkitProvider,
        swapTransactionsProvider: null as unknown as SwapTransactionsProvider
      } as CurrencyInfo;
    });

    return blockchainProvider;
  };

  test.each(redeemRewardNativeCurrencyTestCases)(
    'returns redeem reward for native currency (%s)',
    async (_, { currencyId, prices, redeemFee, expectedRedeemReward }) => {
      const priceManager = createPriceManager(prices);

      const redeemReward = await atomexProtocolV1Helper.getRedeemRewardInNativeCurrency(currencyId, redeemFee, priceManager);
      expect(redeemReward).toEqual(expectedRedeemReward);
    });

  test.each(redeemRewardTokenTestCases)(
    'returns redeem reward for token (%s)',
    async (_, { currencyId, currencies, nativeCurrencyId, prices, redeemFee, expectedRedeemReward }) => {
      const priceManager = createPriceManager(prices);
      const blockchainProvider = createBlockchainProvider(currencies, nativeCurrencyId);

      const redeemReward = await atomexProtocolV1Helper.getRedeemRewardInToken(currencyId, redeemFee, priceManager, blockchainProvider);
      expect(redeemReward).toEqual(expectedRedeemReward);
    });
});
