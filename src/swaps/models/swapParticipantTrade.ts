import type { BigNumber } from 'bignumber.js';

export interface SwapParticipantTrade {
  readonly orderId: number;
  readonly price: BigNumber;
  readonly qty: BigNumber;
}
