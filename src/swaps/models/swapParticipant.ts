import type { BigNumber } from 'bignumber.js';

import type { Transaction } from '../../blockchain/index';
import type { SwapParticipantRequisites } from './swapParticipantRequisites';
import type { SwapParticipantStatus } from './swapParticipantStatus';
import type { SwapTransactionType } from './swapTransactionType';

export interface SwapParticipant {
  readonly status: SwapParticipantStatus;
  readonly requisites: SwapParticipantRequisites;
  readonly trades: readonly ParticipantTrade[];
  readonly transactions: ReadonlyArray<Transaction & SwapTransactionType>;
}

interface ParticipantTrade {
  readonly orderId: string;
  readonly price: BigNumber;
  readonly qty: BigNumber;
}
