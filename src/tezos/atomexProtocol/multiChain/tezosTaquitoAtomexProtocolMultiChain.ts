import type { Wallet } from '@taquito/taquito';

import { atomexProtocolMultiChainHelper } from '../../../blockchain/atomexProtocolMultiChain';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChainInitiateParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import type { PriceManager } from '../../../exchange/index';
import type { TezosTaquitoAtomexProtocolMultiChainOptions } from '../../models/index';
import { mutezInTez } from '../../utils/index';
import type { TezosMultiChainSmartContract } from './contracts';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';

export class TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<TezosTaquitoAtomexProtocolMultiChainOptions>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager,
    priceManager: PriceManager
  ) {
    super('tezos', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager, priceManager);
  }

  async initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction> {
    const wallet = await this.getWallet(params.senderAddress);
    const contract = await wallet.toolkit.wallet.at<TezosMultiChainSmartContract<Wallet>>(this.swapContractAddress);

    const operation = await contract.methodsObject
      .initiate({
        settings: {
          hashed_secret: params.secretHash,
          refund_time: this.formatDate(params.refundTimestamp),
          payoff: params.rewardForRedeem.multipliedBy(mutezInTez),
        },
        participant: params.receivingAddress,
      })
      .send({ amount: params.amount.toNumber() });

    return this.getTransaction('Lock', operation);
  }

  getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo> {
    return atomexProtocolMultiChainHelper.getRedeemRewardInNativeCurrency(this.currencyId, redeemFee, this.priceManager, this.atomexBlockchainProvider);
  }
}
