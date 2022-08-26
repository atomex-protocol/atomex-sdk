import type { AtomexBlockchainNetworkOptions, AtomexCurrencyOptions } from '../../src/atomex/models/atomexOptions';
import { AtomexBlockchainProvider } from '../../src/blockchain/atomexBlockchainProvider';
import type { Currency } from '../../src/common/index';
import { EthereumSwapTransactionsProvider } from '../../src/ethereum/index';
import { Web3BalancesProvider, Web3BlockchainToolkitProvider } from '../../src/evm/index';
import {
  TzktBalancesProvider, TaquitoBlockchainToolkitProvider, TezosCurrency, TezosSwapTransactionsProvider
} from '../../src/tezos/index';

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
    atomexProtocol: { atomexNetwork: 'mainnet', version: 1 }
  };

  const ethereumNativeCurrency: Currency = {
    id: 'ETH',
    name: 'Ethereum',
    symbol: 'ETH',
    blockchain: 'ethereum',
    decimals: 18,
    type: 'native'
  };

  const ethereumNativeCurrencyOptions: AtomexCurrencyOptions = {
    atomexProtocol: { atomexNetwork: 'mainnet', version: 1 }
  };

  let provider: AtomexBlockchainProvider;

  beforeEach(() => {
    provider = new AtomexBlockchainProvider();
  });

  test('applies blockchain options and returns them', () => {
    const tezosNetworkOptions: AtomexBlockchainNetworkOptions = {
      rpcUrl: '',
      balancesProvider: new TzktBalancesProvider(''),
      blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(''),
      swapTransactionsProvider: new TezosSwapTransactionsProvider(),
      currencies: [tezosNativeCurrency],
      currencyOptions: {
        [tezosNativeCurrency.id]: tezosNativeCurrencyOptions
      }
    };

    const ethereumNetworkOptions: AtomexBlockchainNetworkOptions = {
      rpcUrl: '',
      balancesProvider: new Web3BalancesProvider(new AtomexBlockchainProvider()),
      blockchainToolkitProvider: new Web3BlockchainToolkitProvider('ethereum', ''),
      swapTransactionsProvider: new EthereumSwapTransactionsProvider(),
      currencies: [ethereumNativeCurrency],
      currencyOptions: {
        [ethereumNativeCurrency.id]: ethereumNativeCurrencyOptions
      }
    };

    provider.addBlockchain('tezos', tezosNetworkOptions);
    provider.addBlockchain('ethereum', ethereumNetworkOptions);

    const tezosCurrencyInfo = provider.getCurrencyInfo(tezosNativeCurrency.id);
    expect(tezosCurrencyInfo?.currency).toBe(tezosNativeCurrency);
    expect(tezosCurrencyInfo?.atomexProtocol).toBe(tezosNativeCurrencyOptions.atomexProtocol);

    const ethereumCurrencyInfo = provider.getCurrencyInfo(ethereumNativeCurrency.id);
    expect(ethereumCurrencyInfo?.currency).toBe(ethereumNativeCurrency);
    expect(ethereumCurrencyInfo?.atomexProtocol).toBe(ethereumNativeCurrencyOptions.atomexProtocol);

    const btcCurrencyInfo = provider.getCurrencyInfo('BTC');
    expect(btcCurrencyInfo).toBeUndefined();
  });

  test('validates currencies with same key', async () => {
    expect.assertions(1);
    try {
      const networkOptions: AtomexBlockchainNetworkOptions = {
        rpcUrl: '',
        balancesProvider: new TzktBalancesProvider(''),
        blockchainToolkitProvider: new TaquitoBlockchainToolkitProvider(''),
        swapTransactionsProvider: new TezosSwapTransactionsProvider(),
        currencies: [tezosNativeCurrency],
        currencyOptions: {
          [tezosNativeCurrency.id]: tezosNativeCurrencyOptions
        }
      };

      provider.addBlockchain('tezos', networkOptions);
      provider.addBlockchain('ethereum', networkOptions);
    } catch (e) {
      expect((e as Error).message).toMatch('same key');
    }
  });
});
