import type { BigNumber } from 'bignumber.js';

import type { Side } from '../../common';
import type { SwapParticipant } from './swapParticipant';

export interface Swap {
  readonly id: string;
  readonly isInitiator: boolean;
  readonly trade: SwapTrade;
  readonly from: SwapCurrency,
  readonly to: SwapCurrency;
  readonly secret: string | null;
  readonly secretHash: string;
  readonly user: SwapParticipant;
  readonly counterParty: SwapParticipant;
  readonly timeStamp: Date;
}

interface SwapCurrency {
  readonly currencyId: string;
  readonly amount: BigNumber;
  readonly price: BigNumber;
}

interface SwapTrade {
  readonly symbol: string;
  readonly side: Side;
  readonly price: BigNumber;
  readonly qty: BigNumber;
}
