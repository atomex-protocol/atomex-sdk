import type { BigNumber } from 'bignumber.js';

import type { Currency, Side } from '../../common/index';
import type { SwapParticipantRequisites } from '../../swaps/index';
import type { OrderType } from './orderType';

export interface NewOrderRequest {
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
