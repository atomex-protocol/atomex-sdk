import type { Wallet } from '@taquito/taquito';

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
import type { PriceManager } from '../../exchange/index';
import type { TezosTaquitoAtomexProtocolMultiChainOptions } from '../models/index';
import { mutezInTez } from '../utils/index';
import type { TezosMultiChainSmartContract } from './contracts';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';

export class TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain<TezosMultiChainSmartContract<Wallet>> {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<TezosTaquitoAtomexProtocolMultiChainOptions>,
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
    const contract = await this.getSwapContract(params.senderAddress);
    const operation = await contract.methodsObject
      .initiate({
        settings: {
          hashed_secret: params.secretHash,
          refund_time: this.formatDate(params.refundTimestamp),
          payoff: params.rewardForRedeem.multipliedBy(mutezInTez).toString(),
        },
        participant: params.receivingAddress,
      })
      .send({ amount: params.amount.toNumber() });

    return this.getTransaction(operation);
  }

  getInitiateFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    return super.getInitiateFees(params);
  }

  redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction> {
    return super.redeem(params);
  }

  getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo> {
    return atomexProtocolMultiChainHelper.getRedeemRewardInNativeCurrency(this.currencyId, redeemFee, this.priceManager, this.atomexBlockchainProvider);
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
