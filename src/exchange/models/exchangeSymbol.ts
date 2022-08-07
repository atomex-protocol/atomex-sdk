import type BigNumber from 'bignumber.js';

import type { Currency } from '../../common/index';

export interface ExchangeSymbol {
  readonly name: string;
  readonly quoteCurrency: Currency['id'];
  readonly quoteCurrencyDecimals: number;
  readonly baseCurrency: Currency['id'];
  readonly baseCurrencyDecimals: number;
  readonly minimumQty: BigNumber;
}
