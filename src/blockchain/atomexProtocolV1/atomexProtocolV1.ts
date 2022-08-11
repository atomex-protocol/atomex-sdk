import type { BigNumber } from 'bignumber.js';

import type { Currency } from '../../common/index';
import type { AtomexProtocol } from '../atomexProtocol';
import type { Transaction } from '../models/index';
import type { InitiateParametersAtomexProtocolV1 } from './initiateParametersAtomexProtocolV1';
import type { RedeemParametersAtomexProtocolV1 } from './redeemParametersAtomexProtocolV1';
import type { RefundParametersAtomexProtocolV1 } from './refundParametersAtomexProtocolV1';

export interface AtomexProtocolV1 extends AtomexProtocol {
  readonly version: 1;
  readonly currency: Currency;

  initiate(params: InitiateParametersAtomexProtocolV1): Promise<Transaction>;
  getEstimatedInitiateFees(params: Partial<InitiateParametersAtomexProtocolV1>): Promise<BigNumber>;

  redeem(params: RedeemParametersAtomexProtocolV1): Promise<Transaction>;
  getEstimatedRedeemFees(params: Partial<InitiateParametersAtomexProtocolV1>): Promise<BigNumber>;
  getRedeemReward(nativeTokenUsdPrice: number, nativeTokenCurrencyPrice: number): Promise<BigNumber>;

  refund(params: RefundParametersAtomexProtocolV1): Promise<Transaction>;
  getEstimatedRefundFees(params: Partial<InitiateParametersAtomexProtocolV1>): Promise<BigNumber>;
}
