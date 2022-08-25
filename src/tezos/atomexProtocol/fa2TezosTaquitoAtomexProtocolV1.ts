import type BigNumber from 'bignumber.js';

import { getRedeemRewardInNativeToken } from '../../blockchain/atomexProtocolV1';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { FA2TezosTaquitoAtomexProtocolV1Options } from '../models/index';
import { TaquitoAtomexProtocolV1 } from './taquitoAtomexProtocolV1';

export class FA2TezosTaquitoAtomexProtocolV1 extends TaquitoAtomexProtocolV1 {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<FA2TezosTaquitoAtomexProtocolV1Options>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager
  ) {
    super('tezos', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    return super.getInitiateFees(params);
  }

  redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  async getRedeemReward(nativeTokenPriceInUsd: BigNumber, nativeTokenPriceInCurrency: BigNumber, redeemFee: BigNumber): Promise<FeesInfo> {
    const inNativeToken = getRedeemRewardInNativeToken(nativeTokenPriceInUsd, redeemFee);

    return {
      estimated: inNativeToken.estimated.multipliedBy(nativeTokenPriceInCurrency),
      max: inNativeToken.max.multipliedBy(nativeTokenPriceInCurrency)
    };
  }

  getRedeemFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    return super.getRedeemFees(params);
  }

  refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRefundFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    return super.getRefundFees(params);
  }
}
