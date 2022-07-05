import type { BigNumber } from 'bignumber.js';

export interface InitiateParameters {
  readonly amount: BigNumber;
  readonly secretHash: string;
  readonly receivingAddress: string;
  readonly refundAddress?: string;
  readonly rewardForRedeem: BigNumber;
  readonly refundTimestamp: Date;
}
