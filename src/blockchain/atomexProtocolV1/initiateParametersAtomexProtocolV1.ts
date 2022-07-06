import type { BigNumber } from 'bignumber.js';

export interface InitiateParametersAtomexProtocolV1 {
  readonly amount: BigNumber;
  readonly secretHash: string;
  readonly receivingAddress: string;
  readonly refundAddress?: string;
  readonly rewardForRedeem: BigNumber;
  readonly refundTimestamp: Date;
}
