import BigNumber from 'bignumber.js';

import { Currency } from '../../index';

export interface ExchangeSymbol {
  readonly name: string;
  readonly quoteCurrency: Currency['id'];
  readonly baseCurrency: Currency['id'];
  readonly minimumQty: BigNumber;
}
