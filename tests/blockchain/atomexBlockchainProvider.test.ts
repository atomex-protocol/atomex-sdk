import type { AtomexBlockchainNetworkOptions, AtomexCurrencyOptions } from '../../src/atomex/models/atomexOptions';
import { AtomexBlockchainProvider } from '../../src/blockchain/atomexBlockchainProvider';
import type { Currency } from '../../src/common/index';
import type { TezosCurrency } from '../../src/tezos/index';

describe('Atomex Blockchain Provider', () => {
  const tezosNativeCurrency: TezosCurrency = {
    id: 'XTZ',
    name: 'Tezos',
    symbol: 'XTZ',
    blockchain: 'tezos',
    decimals: 6,
    type: 'native'
  };

  const tezosNativeCurrencyOptions: AtomexCurrencyOptions = {
    atomexProtocol: { network: 'mainnet', version: 1 }
  };

  const ethereumNativeCurrency: Currency = {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    blockchain: 'ethereum',
    decimals: 18,
    type: 'native'
  };

  let provider: AtomexBlockchainProvider;

  beforeEach(() => {
    provider = new AtomexBlockchainProvider();
  });

  test('applies blockchain options and returns them', () => {
    const tezosNetworkOptions: AtomexBlockchainNetworkOptions = {
      currencies: [tezosNativeCurrency],
      currencyOptions: {
        [tezosNativeCurrency.id]: tezosNativeCurrencyOptions
      }
    };

    const ethereumNetworkOptions: AtomexBlockchainNetworkOptions = {
      currencies: [ethereumNativeCurrency],
      currencyOptions: {}
    };

    provider.addBlockchain(tezosNetworkOptions);
    provider.addBlockchain(ethereumNetworkOptions);

    const tezosCurrencyInfo = provider.getCurrencyInfo(tezosNativeCurrency.id);
    expect(tezosCurrencyInfo?.currency).toBe(tezosNativeCurrency);
    expect(tezosCurrencyInfo?.atomexProtocol).toBe(tezosNativeCurrencyOptions.atomexProtocol);

    const ethereumCurrencyInfo = provider.getCurrencyInfo(ethereumNativeCurrency.id);
    expect(ethereumCurrencyInfo?.currency).toBe(ethereumNativeCurrency);
    expect(ethereumCurrencyInfo?.atomexProtocol).toBeUndefined();

    const btcCurrencyInfo = provider.getCurrencyInfo('BTC');
    expect(btcCurrencyInfo).toBeUndefined();
  });

  test('validates currencies with same key', async () => {
    expect.assertions(1);
    try {
      const networkOptions = {
        currencies: [tezosNativeCurrency],
        currencyOptions: {
          [tezosNativeCurrency.id]: tezosNativeCurrencyOptions
        }
      };

      provider.addBlockchain(networkOptions);
      provider.addBlockchain(networkOptions);
    } catch (e) {
      expect((e as Error).message).toMatch('same key');
    }
  });
});
