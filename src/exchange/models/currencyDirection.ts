import { Currency } from '../../index';

export interface CurrencyDirection {
  from: Currency['id'];
  to: Currency['id'];
}
