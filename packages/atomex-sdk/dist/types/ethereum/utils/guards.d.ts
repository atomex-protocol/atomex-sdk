import type { Currency } from '../../common';
import type { EthereumCurrency } from '../models';
export declare const isEthereumCurrency: (currency: Currency) => currency is EthereumCurrency;
