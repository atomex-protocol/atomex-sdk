import type { AtomexBlockchainNetworkOptions } from '../atomex/models/atomexOptions';
import type { TezosCurrency, TezosFA12Currency, TezosFA2Currency } from './models/index';

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
  type: 'fa1.2',
  contractAddress: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
  decimals: 8,
};

const usdtCurrency: TezosFA2Currency = {
  id: 'USDT_XTZ',
  name: 'Tether USD',
  symbol: 'USDt',
  blockchain: 'tezos',
  type: 'fa2',
  tokenId: 0,
  contractAddress: 'KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o',
  decimals: 6,
};

export const tezosMainnetCurrencies: AtomexBlockchainNetworkOptions['currencies'] = [
  tezosNativeCurrency,
  tzBtcCurrency,
  usdtCurrency
];

export const tezosTestnetCurrencies: AtomexBlockchainNetworkOptions['currencies'] = [
  tezosNativeCurrency,
  ({ ...tzBtcCurrency, contractAddress: 'KT1DM4k79uSx5diQnwqDiF4XeA86aCBxBD35' } as TezosFA12Currency),
  ({ ...usdtCurrency, contractAddress: 'KT1BWvRQnVVowZZLGkct9A7sdj5YEe8CdUhR' } as TezosFA2Currency)
];
