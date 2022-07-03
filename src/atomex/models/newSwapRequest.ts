import type { BigNumber } from 'bignumber.js';

import { Currency, Side } from '../../common/index';
import { OrderType } from '../../exchange/index';
import { SwapParticipantRequisites } from '../../swaps/index';

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
