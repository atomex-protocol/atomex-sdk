import type { Currency } from '../../common';
import type { EthereumCurrency } from '../models';

export const isEthereumCurrency = (currency: Currency): currency is EthereumCurrency => {
  return currency.blockchain === 'ethereum';
};
