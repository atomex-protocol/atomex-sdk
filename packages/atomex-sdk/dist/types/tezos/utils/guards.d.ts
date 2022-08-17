import type { Currency } from '../../common';
import type { TezosCurrency } from '../models';
export declare const isTezosCurrency: (currency: Currency) => currency is TezosCurrency;
