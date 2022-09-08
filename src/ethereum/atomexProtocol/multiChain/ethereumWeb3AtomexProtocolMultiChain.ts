import type { TransactionReceipt } from 'web3-core';

import { AtomexProtocolMultiChain, atomexProtocolMultiChainHelper } from '../../../blockchain/atomexProtocolMultiChain';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChainInitiateParameters,
  AtomexProtocolMultiChainRedeemParameters,
  AtomexProtocolMultiChainRefundParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import { Web3AtomexProtocolMultiChain } from '../../../evm/index';
import type { PriceManager } from '../../../exchange';
import type { EthereumWeb3AtomexProtocolMultiChainOptions } from '../../models/index';

export class EthereumWeb3AtomexProtocolMultiChain extends Web3AtomexProtocolMultiChain implements AtomexProtocolMultiChain {
  readonly type = 'multi-chain';

  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<EthereumWeb3AtomexProtocolMultiChainOptions>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager,
    priceManager: PriceManager
  ) {
    super('ethereum', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager, priceManager);
  }

  async initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction> {
    const wallet = await this.getWallet(params.senderAddress);
    const contract = new wallet.toolkit.eth.Contract(
      this.atomexProtocolOptions.abi as EthereumWeb3AtomexProtocolMultiChainOptions['abi'],
      this.swapContractAddress
    );
    const data: string = contract.methods
      .initiate(
        '0x' + params.secretHash,
        params.receivingAddress,
        Math.round(params.refundTimestamp.getTime() / 1000),
        params.rewardForRedeem.toString(10),
      )
      .encodeABI();

    const gas = params.rewardForRedeem.isZero()
      ? this.atomexProtocolOptions.initiateOperation.gasLimit.withoutReward
      : this.atomexProtocolOptions.initiateOperation.gasLimit.withReward;

    const receipt: TransactionReceipt = await wallet.toolkit.eth.sendTransaction({
      from: params.senderAddress,
      to: this.swapContractAddress,
      value: wallet.toolkit.utils.toWei(params.amount.toString(10), 'ether'),
      gas,
      data,
    });

    return this.getTransaction(wallet.toolkit, 'Lock', receipt);
  }

  async redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction> {
    const wallet = await this.getWallet(params.senderAddress);
    const contract = new wallet.toolkit.eth.Contract(
      this.atomexProtocolOptions.abi as EthereumWeb3AtomexProtocolMultiChainOptions['abi'],
      this.atomexProtocolOptions.swapContractAddress
    );

    const receipt: TransactionReceipt = await contract.methods
      .redeem(`0x${params.secretHash}`, `0x${params.secret}`)
      .send({
        from: params.senderAddress,
        gas: this.atomexProtocolOptions.redeemOperation.gasLimit,
      });

    return this.getTransaction(wallet.toolkit, 'Redeem', receipt);
  }

  getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo> {
    return atomexProtocolMultiChainHelper.getRedeemRewardInNativeCurrency(this.currencyId, redeemFee, this.priceManager, this.atomexBlockchainProvider);
  }

  async refund(params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction> {
    const wallet = await this.getWallet(params.senderAddress);
    const contract = new wallet.toolkit.eth.Contract(
      this.atomexProtocolOptions.abi as EthereumWeb3AtomexProtocolMultiChainOptions['abi'],
      this.atomexProtocolOptions.swapContractAddress
    );

    const receipt: TransactionReceipt = await contract.methods
      .refund(`0x${params.secretHash}`)
      .send({
        from: params.senderAddress,
        gas: this.atomexProtocolOptions.refundOperation.gasLimit,
      });

    return this.getTransaction(wallet.toolkit, 'Refund', receipt);
  }
}
