import type { Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { atomexProtocolMultiChainHelper } from '../../blockchain/atomexProtocolMultiChain';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChainInitiateParameters,
  AtomexProtocolMultiChainRedeemParameters,
  AtomexProtocolMultiChainRefundParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { PriceManager } from '../../exchange';
import type { FA12TezosTaquitoAtomexProtocolMultiChainOptions } from '../models/index';
import { isFA12TezosCurrency } from '../utils';
import type { FA12TezosMultiChainSmartContract } from './contracts';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';

export class FA12TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain<FA12TezosMultiChainSmartContract<Wallet>> {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<FA12TezosTaquitoAtomexProtocolMultiChainOptions>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager,
    priceManager: PriceManager
  ) {
    super('tezos', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager, priceManager);
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  async initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction> {
    const currency = this.atomexBlockchainProvider.getCurrency(this.currencyId);
    if (!currency)
      throw new Error(`Currency not found for id: ${this.currencyId}`);

    if (!isFA12TezosCurrency(currency))
      throw new Error(`Currency is not fa1.2; id: ${this.currencyId}`);

    const contract = await this.getSwapContract(params.senderAddress);
    const multiplier = new BigNumber(10).pow(currency.decimals);
    const operation = await contract.methodsObject
      .initiate({
        totalAmount: params.amount.multipliedBy(multiplier).toString(),
        tokenAddress: currency.contractAddress,
        refundTime: this.formatDate(params.refundTimestamp),
        payoffAmount: params.rewardForRedeem.multipliedBy(multiplier).toString(),
        hashedSecret: params.secretHash,
        participant: params.receivingAddress,
      })
      .send();

    return this.getTransaction('Lock', operation);
  }

  getInitiateFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    return super.getInitiateFees(params);
  }

  redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction> {
    return super.redeem(params);
  }

  getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo> {
    return atomexProtocolMultiChainHelper.getRedeemRewardInToken(this.currencyId, redeemFee, this.priceManager, this.atomexBlockchainProvider);
  }

  getRedeemFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    return super.getRedeemFees(params);
  }

  refund(params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction> {
    return super.refund(params);
  }

  getRefundFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    return super.getRefundFees(params);
  }
}
