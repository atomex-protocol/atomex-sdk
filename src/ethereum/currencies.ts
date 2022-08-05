import type { AtomexBlockchainNetworkOptions } from '../atomex/models/atomexOptions';
import type { Currency } from '../common/index';

const ethereumNativeCurrency: Currency = {
  id: 'ETH',
  name: 'Ethereum',
  symbol: 'ETH',
  blockchain: 'ethereum',
  decimals: 18,
  type: 'native'
};

export const ethereumMainnetCurrencies: AtomexBlockchainNetworkOptions['currencies'] = [
  ethereumNativeCurrency
];

export const ethereumTestnetCurrencies: AtomexBlockchainNetworkOptions['currencies'] = [
  ethereumNativeCurrency
];
