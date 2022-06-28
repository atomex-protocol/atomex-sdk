import type { InitiateParameters, RedeemParameters, RefundParameters, Transaction } from './models';

export interface AtomexProtocol {
  readonly version: 1;

  initiate(params: InitiateParameters): Promise<Transaction>;
  redeem(params: RedeemParameters): Promise<Transaction>;
  refund(params: RefundParameters): Promise<Transaction>;
}
