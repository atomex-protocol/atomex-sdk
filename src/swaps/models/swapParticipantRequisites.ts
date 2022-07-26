import type { BigNumber } from 'bignumber.js';

export interface SwapParticipantRequisites {
  readonly secretHash: string | null;
  readonly receivingAddress: string;
  readonly refundAddress: string | null;
  readonly rewardForRedeem: BigNumber;
  readonly lockTime: number;
  readonly baseCurrencyContract: string;
  readonly quoteCurrencyContract: string;
}
