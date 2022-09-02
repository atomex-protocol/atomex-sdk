import type { Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { atomexProtocolMultiChainHelper } from '../../../blockchain/atomexProtocolMultiChain';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChainInitiateParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import type { PriceManager } from '../../../exchange';
import type { FA12Contract } from '../../contracts/index';
import type { FA12TezosTaquitoAtomexProtocolMultiChainOptions } from '../../models/index';
import { fa12helper, isFA12TezosCurrency } from '../../utils';
import type { FA12TezosMultiChainSmartContract } from './contracts';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';

export class FA12TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<FA12TezosTaquitoAtomexProtocolMultiChainOptions>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager,
    priceManager: PriceManager
  ) {
    super('tezos', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager, priceManager);
  }

  async initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction> {
    const currency = this.atomexBlockchainProvider.getCurrency(this.currencyId);
    if (!currency)
      throw new Error(`Currency not found for id: ${this.currencyId}`);

    if (!isFA12TezosCurrency(currency))
      throw new Error(`Currency with id ${this.currencyId} is not fa1.2`);

    const wallet = await this.getWallet(params.senderAddress);
    const tokenContract = await wallet.toolkit.wallet.at<FA12Contract<Wallet>>(currency.contractAddress);
    const contract = await wallet.toolkit.wallet.at<FA12TezosMultiChainSmartContract<Wallet>>(this.swapContractAddress);
    const multiplier = new BigNumber(10).pow(currency.decimals);
    const totalAmount = params.amount.multipliedBy(multiplier);

    const operation = await fa12helper.wrapContractCallsWithApprove({
      toolkit: wallet.toolkit,
      tokenContract,
      approvedAmount: totalAmount,
      approvedAddress: contract.address,
      contractCalls: [
        contract.methodsObject.initiate({
          totalAmount,
          tokenAddress: currency.contractAddress,
          refundTime: this.formatDate(params.refundTimestamp),
          payoffAmount: params.rewardForRedeem.multipliedBy(multiplier),
          hashedSecret: params.secretHash,
          participant: params.receivingAddress,
        })
      ]
    }).send();

    return this.getTransaction('Lock', operation);
  }

  getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo> {
    return atomexProtocolMultiChainHelper.getRedeemRewardInToken(this.currencyId, redeemFee, this.priceManager, this.atomexBlockchainProvider);
  }
}
