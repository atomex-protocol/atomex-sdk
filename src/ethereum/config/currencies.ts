import type { AtomexBlockchainNetworkOptions } from '../../atomex/models/atomexOptions';
import type { EthereumCurrency } from '../models/currency';

const ethereumNativeCurrency: EthereumCurrency = {
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