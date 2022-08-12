import type { EthereumCurrency, NativeEthereumCurrency } from '../models/currency';

const nativeEthereumCurrency: NativeEthereumCurrency = {
  id: 'ETH',
  name: 'Ethereum',
  symbol: 'ETH',
  blockchain: 'ethereum',
  decimals: 18,
  type: 'native'
};

export const ethereumMainnetCurrencies: EthereumCurrency[] = [
  nativeEthereumCurrency
];

export const ethereumTestnetCurrencies: EthereumCurrency[] = [
  nativeEthereumCurrency
];
