import type BigNumber from 'bignumber.js';

import type {
  AtomexProtocolV1, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  Transaction
} from '../../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../../common/index';
import type { DeepReadonly } from '../../core';
import type { FA2TezosTaquitoAtomexProtocolV1Options } from '../models/atomexProtocolOptions';

export class FA2TezosTaquitoAtomexProtocolV1 implements AtomexProtocolV1 {
  readonly version = 1;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly currenciesProvider: CurrenciesProvider,
    protected readonly atomexProtocolOptions: DeepReadonly<FA2TezosTaquitoAtomexProtocolV1Options>
  ) {
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getEstimatedInitiateFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  getEstimatedRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getEstimatedRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }
}
