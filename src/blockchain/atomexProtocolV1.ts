import type { BigNumber } from 'bignumber.js';

import type { Currency } from '../index';
import type { AtomexProtocol } from './atomexProtocol';
import type { InitiateParameters, RedeemParameters, RefundParameters, Transaction } from './models/index';

export interface AtomexProtocolV1 extends AtomexProtocol {
  readonly version: 1;
  readonly currency: Currency;

  initiate(params: InitiateParameters): Promise<Transaction>;
  getEstimatedInitiateFees(params: Partial<InitiateParameters>): Promise<BigNumber>;

  redeem(params: RedeemParameters): Promise<Transaction>;
  getEstimatedRedeemFees(params: Partial<InitiateParameters>): Promise<BigNumber>;

  refund(params: RefundParameters): Promise<Transaction>;
  getEstimatedRefundFees(params: Partial<InitiateParameters>): Promise<BigNumber>;
}
