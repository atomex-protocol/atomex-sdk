import type { Currency } from '../../common';
import type { TezosCurrency } from '../models';

export const isTezosCurrency = (currency: Currency): currency is TezosCurrency => {
  return currency.blockchain === 'tezos';
};   
