import type { BigNumber } from 'bignumber.js';

import type { Side } from '../../common/index';
import type { Mutable } from '../../core/index';
import type { SwapParticipantRequisites } from '../../swaps/index';
import type { OrderPreview } from './orderPreview';
import type { OrderType } from './orderType';
import type { ProofOfFunds } from './proofOfFunds';

interface OrderBody {
  type: OrderType;
  price: BigNumber;
  amount: BigNumber;
  symbol: string;
  side: Side;
}

export interface NewOrderRequest {
  clientOrderId?: string;
  orderBody: OrderBody | OrderPreview;
  requisites: Mutable<SwapParticipantRequisites>;
  proofsOfFunds?: ProofOfFunds[];
}

export interface FilledNewOrderRequest {
  readonly clientOrderId: string;
  readonly orderBody: OrderBody | OrderPreview;
  readonly requisites: Mutable<SwapParticipantRequisites>;
  readonly proofsOfFunds: ProofOfFunds[];
}

