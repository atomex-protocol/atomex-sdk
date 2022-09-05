import type { Currency } from '../../common';
import type { FA12TezosCurrency, FA2TezosCurrency, TezosCurrency } from '../models';

export const isTezosCurrency = (currency: Currency): currency is TezosCurrency => {
  return currency.blockchain === 'tezos';
};

export const isFA12TezosCurrency = (currency: Currency): currency is FA12TezosCurrency => {
  return currency.blockchain === 'tezos' && currency.type === 'fa1.2';
};

export const isFA2TezosCurrency = (currency: Currency): currency is FA2TezosCurrency => {
  return currency.blockchain === 'tezos' && currency.type === 'fa2';
};   
