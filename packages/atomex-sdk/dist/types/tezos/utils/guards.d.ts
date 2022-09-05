import type { Currency } from '../../common';
import type { FA12TezosCurrency, FA2TezosCurrency, TezosCurrency } from '../models';
export declare const isTezosCurrency: (currency: Currency) => currency is TezosCurrency;
export declare const isFA12TezosCurrency: (currency: Currency) => currency is FA12TezosCurrency;
export declare const isFA2TezosCurrency: (currency: Currency) => currency is FA2TezosCurrency;
