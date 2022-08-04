import type { AtomexBlockchainNetworkOptions } from '../../atomex/models/atomexOptions';
import type { TezosCurrency, TezosFA12Currency, TezosFA2Currency } from '../../tezos/index';

const tezosNativeCurrency: TezosCurrency = {
  id: 'XTZ',
  name: 'Tezos',
  symbol: 'XTZ',
  blockchain: 'tezos',
  decimals: 6,
  type: 'native'
};

const tzBtcCurrency: TezosFA12Currency = {
  id: 'TZBTC',
  name: 'tzBTC',
  symbol: 'tzBTC',
  blockchain: 'tezos',
  decimals: 8,
  type: 'fa1.2'
};

const usdtCurrency: TezosFA2Currency = {
  id: 'USDT_XTZ',
  name: 'Tether USD',
  symbol: 'USDt',
  blockchain: 'tezos',
  decimals: 6,
  tokenId: 0,
  type: 'fa2'
};

export const tezosMainnetCurrencies: AtomexBlockchainNetworkOptions['currencies'] = [
  tezosNativeCurrency,
  tzBtcCurrency,
  usdtCurrency
];

export const tezosTestnetCurrencies: AtomexBlockchainNetworkOptions['currencies'] = [
  tezosNativeCurrency,
  tzBtcCurrency,
  usdtCurrency
];
