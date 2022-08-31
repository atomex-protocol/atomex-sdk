import type { Currency } from '../../common';
import type { FA12TezosCurrency, TezosCurrency } from '../models';

export const isTezosCurrency = (currency: Currency): currency is TezosCurrency => {
  return currency.blockchain === 'tezos';
};

export const isFA12TezosCurrency = (currency: Currency): currency is FA12TezosCurrency => {
  return currency.blockchain === 'tezos' && currency.type === 'fa1.2';
};   
