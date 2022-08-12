import type { BigNumber } from 'bignumber.js';

import type { Currency } from '../../common/index';
import type { AtomexProtocol } from '../atomexProtocol';
import type { Transaction } from '../models/index';
import type { AtomexProtocolV1InitiateParameters } from './initiateParameters';
import type { AtomexProtocolV1RedeemParameters } from './redeemParameters';
import type { AtomexProtocolV1RefundParameters } from './refundParameters';

export interface AtomexProtocolV1 extends AtomexProtocol {
  readonly version: 1;
  readonly currencyId: Currency['id'];

  initiate(params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;
  getEstimatedInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber>;

  redeem(params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;
  getEstimatedRedeemFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber>;
  getRedeemReward(nativeTokenPriceInUsd: number, nativeTokenPriceInCurrency: number): Promise<BigNumber>;

  refund(params: AtomexProtocolV1RefundParameters): Promise<Transaction>;
  getEstimatedRefundFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber>;
}
