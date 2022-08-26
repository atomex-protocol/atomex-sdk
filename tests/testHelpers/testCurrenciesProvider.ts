import { Currency, InMemoryCurrenciesProvider } from '../../src/common/index';
import { ethereumTestnetCurrencies } from '../../src/ethereum/index';
import type { ERC20EthereumCurrency } from '../../src/ethereum/models';
import { tezosTestnetCurrencies } from '../../src/tezos/index';

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
      ...ethereumTestnetCurrencies,
      usdtCurrency,
      ...tezosTestnetCurrencies,
      btcCurrency,
      ltcCurrency
    ]);
  }
}
