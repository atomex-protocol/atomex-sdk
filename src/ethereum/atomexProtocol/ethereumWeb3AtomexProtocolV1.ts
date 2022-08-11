import type BigNumber from 'bignumber.js';

import type {
  AtomexProtocolV1, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  Transaction
} from '../../blockchain/index';
import type { AtomexNetwork, CurrenciesProvider } from '../../common/index';
import type { DeepReadonly } from '../../core';
import type { EthereumAtomexProtocolV1Options } from '../models/atomexProtocolOptions';

export class EthereumWeb3AtomexProtocolV1 implements AtomexProtocolV1 {
  readonly version = 1;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    protected readonly currenciesProvider: CurrenciesProvider,
    protected readonly atomexProtocolOptions: DeepReadonly<EthereumAtomexProtocolV1Options>
  ) {
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  initiate(params: AtomexProtocolV1InitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getEstimatedInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  redeem(params: AtomexProtocolV1RedeemParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRedeemReward(nativeTokenUsdPrice: number, nativeTokenCurrencyPrice: number): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  getEstimatedRedeemFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  refund(params: AtomexProtocolV1RefundParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
  getEstimatedRefundFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

}
