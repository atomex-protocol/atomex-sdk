import type { BigNumber } from 'bignumber.js';

import { Currency, Side } from '../../common';
import { OrderType } from '../../exchange';
import { SwapParticipantRequisites } from '../../swaps';

export interface NewSwapRequest {
  from: Currency['id'];
  to: Currency['id'];
  side: Side;
  price: BigNumber;
  amount: BigNumber;
  type: OrderType;
  // TODO:
  // proofsOfFunds?: ProofOfFunds[];
  requisites?: SwapParticipantRequisites;
}
