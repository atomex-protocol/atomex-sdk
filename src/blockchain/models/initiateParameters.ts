import type { BigNumber } from 'bignumber.js';

import { Currency } from '../../common';

export interface InitiateParameters {
  readonly amount: BigNumber;
  readonly currency: Currency;
  readonly secretHash: string;
  readonly receivingAddress: string;
  readonly refundAddress?: string;
  readonly rewardForRedeem: BigNumber;
  readonly refundTimestamp: Date;
}
