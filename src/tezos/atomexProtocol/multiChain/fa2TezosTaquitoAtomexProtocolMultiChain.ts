import type { Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { atomexProtocolMultiChainHelper } from '../../../blockchain/atomexProtocolMultiChain';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChainInitiateParameters,
  AtomexProtocolMultiChainRedeemParameters,
  AtomexProtocolMultiChainRefundParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import type { PriceManager } from '../../../exchange/index';
import type { FA2Contract } from '../../contracts/index';
import type { FA2TezosTaquitoAtomexProtocolMultiChainOptions } from '../../models/index';
import { fa2helper } from '../../utils';
import { isFA2TezosCurrency } from '../../utils/guards';
import type { FA2TezosMultiChainSmartContract } from './contracts';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';

export class FA2TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<FA2TezosTaquitoAtomexProtocolMultiChainOptions>,
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

    if (!isFA2TezosCurrency(currency))
      throw new Error(`Currency with id ${this.currencyId} is not fa2`);

    const wallet = await this.getWallet(params.senderAddress);
    const tokenContract = await wallet.toolkit.wallet.at<FA2Contract<Wallet>>(currency.contractAddress);
    const contract = await wallet.toolkit.wallet.at<FA2TezosMultiChainSmartContract<Wallet>>(this.swapContractAddress);
    const multiplier = new BigNumber(10).pow(currency.decimals);

    const operation = await fa2helper.wrapContractCallsWithApprove({
      toolkit: wallet.toolkit,
      ownerAddress: params.senderAddress,
      approvedAddress: contract.address,
      tokenContract,
      tokenId: currency.tokenId,
      contractCalls: [
        contract.methodsObject.initiate({
          totalAmount: params.amount.multipliedBy(multiplier),
          tokenAddress: currency.contractAddress,
          tokenId: currency.tokenId,
          refundTime: this.formatDate(params.refundTimestamp),
          payoffAmount: params.rewardForRedeem.multipliedBy(multiplier),
          hashedSecret: params.secretHash,
          participant: params.receivingAddress,
        })
      ]
    }).send();

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
