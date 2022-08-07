import { InMemoryCurrenciesProvider } from '../../src/common/index';
import { ethereumMainnetCurrencies } from '../../src/ethereum/currencies';
import type { Currency, TezosFA12Currency } from '../../src/index';
import { tezosMainnetCurrencies } from '../../src/tezos/currencies';

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
  decimals: 18
};

const usdtCurrency: Currency = {
  id: 'USDT',
  name: 'USDt',
  blockchain: 'ethereum',
  symbol: 'USDT',
  type: 'erc20',
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
