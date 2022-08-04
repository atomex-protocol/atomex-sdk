import type { AtomexBlockchainOptions } from '../../atomex/models/atomexOptions';
import type { Currency } from '../../common/index';

const ethereumNativeCurrency: Currency = {
  id: 'ETH',
  name: 'Ethereum',
  symbol: 'ETH',
  blockchain: 'ethereum',
  decimals: 18,
  type: 'native'
};

export const ethereumBlockchainOptions: AtomexBlockchainOptions = {
  mainnet: {
    currencies: [
      ethereumNativeCurrency
    ],
    currencyOptions: {
    }
  },
  testnet: {
    currencies: [
      ethereumNativeCurrency
    ],
    currencyOptions: {
    }
  }
};
