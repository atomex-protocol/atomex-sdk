import type { BigNumber } from 'bignumber.js';

import type { Currency } from '../../common/index';

/**
 * Symbol's quote
 */
export interface Quote {
  readonly symbol: string;
  readonly baseCurrency: Currency['id'];
  readonly quoteCurrency: Currency['id'];
  readonly timeStamp: Date;
  readonly bid: BigNumber;
  readonly ask: BigNumber;
}
