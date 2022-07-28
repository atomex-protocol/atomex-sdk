import type BigNumber from 'bignumber.js';

import type { Currency } from '../../index';

export interface ExchangeSymbol {
  readonly name: string;
  readonly quoteCurrency: Currency['id'];
  readonly baseCurrency: Currency['id'];
  readonly minimumQty: BigNumber;
}
