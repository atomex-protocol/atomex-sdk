import type { NativeTezosCurrency, TezosCurrency, FA12TezosCurrency, FA2TezosCurrency } from '../models/index';

const nativeTezosCurrency: NativeTezosCurrency = {
  id: 'XTZ',
  name: 'Tezos',
  symbol: 'XTZ',
  blockchain: 'tezos',
  decimals: 6,
  type: 'native'
};

const tzBtcCurrency: FA12TezosCurrency = {
  id: 'TZBTC',
  name: 'tzBTC',
  symbol: 'tzBTC',
  blockchain: 'tezos',
  type: 'fa1.2',
  contractAddress: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
  decimals: 8,
};

const kusdCurrency: FA12TezosCurrency = {
  id: 'KUSD',
  name: 'Kolibri USD',
  symbol: 'kUSD',
  blockchain: 'tezos',
  type: 'fa1.2',
  contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
  decimals: 18
};

const usdtCurrency: FA2TezosCurrency = {
  id: 'USDT_XTZ',
  name: 'Tether USD',
  symbol: 'USDt',
  blockchain: 'tezos',
  type: 'fa2',
  tokenId: 0,
  contractAddress: 'KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o',
  decimals: 6,
};

export const tezosMainnetCurrencies: TezosCurrency[] = [
  nativeTezosCurrency,
  tzBtcCurrency,
  kusdCurrency,
  usdtCurrency
];

export const tezosTestnetCurrencies: TezosCurrency[] = [
  nativeTezosCurrency,
  // ({ ...tzBtcCurrency, contractAddress: 'KT1DM4k79uSx5diQnwqDiF4XeA86aCBxBD35' } as FA12TezosCurrency),
  ({ ...usdtCurrency, contractAddress: 'KT1BWvRQnVVowZZLGkct9A7sdj5YEe8CdUhR' } as FA2TezosCurrency)
];
