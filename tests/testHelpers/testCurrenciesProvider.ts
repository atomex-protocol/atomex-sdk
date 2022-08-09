import { InMemoryCurrenciesProvider } from '../../src/common/index';
import { ethereumMainnetCurrencies } from '../../src/ethereum/index';
import type { ERC20EthereumCurrency } from '../../src/ethereum/models/index';
import type { Currency, TezosFA12Currency } from '../../src/index';
import { tezosMainnetCurrencies } from '../../src/tezos/index';

const btcCurrency: Currency = {
  id: 'BTC',
  name: 'Bitcoin',
  blockchain: 'bitcoin',
  symbol: 'BTC',
  type: 'native',
  decimals: 8,
};

const ltcCurrency: Currency = {
  id: 'LTC',
  name: 'Litecoin',
  blockchain: 'litecoin',
  symbol: 'LTC',
  type: 'native',
  decimals: 8,
};

const kusdCurrency: TezosFA12Currency = {
  id: 'KUSD',
  name: 'Kolibri USD',
  blockchain: 'tezos',
  symbol: 'KUSD',
  type: 'fa1.2',
  contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
  decimals: 18
};

const usdtCurrency: ERC20EthereumCurrency = {
  id: 'USDT',
  name: 'USDt',
  blockchain: 'ethereum',
  symbol: 'USDT',
  type: 'erc-20',
  contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  decimals: 6
};

export class TestCurrenciesProvider extends InMemoryCurrenciesProvider {
  constructor() {
    super([
      btcCurrency,
      ltcCurrency,
      kusdCurrency,
      usdtCurrency,
      ...ethereumMainnetCurrencies,
      ...tezosMainnetCurrencies,
    ]);
  }
}
