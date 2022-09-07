import BigNumber from 'bignumber.js';
import type Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core';

import type { AtomexProtocolMultiChainBase } from '../../../blockchain/atomexProtocolMultiChain';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChainInitiateParameters,
  AtomexProtocolMultiChainRedeemParameters, AtomexProtocolMultiChainRefundParameters,
  BlockchainWallet, FeesInfo, Transaction, WalletsManager
} from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import type { PriceManager } from '../../../exchange';
import { web3Helper } from '../../helpers';
import type { Web3AtomexProtocolMultiChainOptions } from '../../models/index';

export abstract class Web3AtomexProtocolMultiChain implements AtomexProtocolMultiChainBase {
  protected static readonly defaultMaxNetworkFeeMultiplier = new BigNumber(1.2);

  abstract readonly type: string;

  constructor(
    protected readonly blockchain: string,
    readonly atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<Web3AtomexProtocolMultiChainOptions>,
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider,
    protected readonly walletsManager: WalletsManager,
    protected readonly priceManager: PriceManager
  ) { }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  get swapContractAddress() {
    return this.atomexProtocolOptions.swapContractAddress;
  }

  abstract initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;

  async getInitiateFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    const toolkit = await this.getReadonlyWeb3();
    const maxFeePerGasInWei = await web3Helper.getMaxFeePerGas(toolkit);
    const gasLimitOptions = this.atomexProtocolOptions.initiateOperation.gasLimit;
    const hasRewardForRedeem = params.rewardForRedeem?.isGreaterThan(0);
    const gasLimit = new BigNumber(hasRewardForRedeem ? gasLimitOptions.withReward : gasLimitOptions.withoutReward);

    const estimatedInWei = maxFeePerGasInWei.multipliedBy(gasLimit);
    const estimated = web3Helper.convertFromWei(toolkit, estimatedInWei, 'ether');
    const max = estimated.multipliedBy(Web3AtomexProtocolMultiChain.defaultMaxNetworkFeeMultiplier);
    const result: FeesInfo = { estimated, max };

    return Promise.resolve(result);
  }

  abstract redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction>;

  abstract getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;

  async getRedeemFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    const toolkit = await this.getReadonlyWeb3();
    const maxFeePerGasInWei = await web3Helper.getMaxFeePerGas(toolkit);
    const gasLimit = this.atomexProtocolOptions.redeemOperation.gasLimit;

    const estimatedWei = maxFeePerGasInWei.multipliedBy(gasLimit).multipliedBy(Web3AtomexProtocolMultiChain.defaultMaxNetworkFeeMultiplier);
    const estimated = web3Helper.convertFromWei(toolkit, estimatedWei, 'ether');
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  abstract refund(params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction>;

  async getRefundFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    const toolkit = await this.getReadonlyWeb3();
    const maxFeePerGasInWei = await web3Helper.getMaxFeePerGas(toolkit);
    const gasLimit = this.atomexProtocolOptions.refundOperation.gasLimit;

    const estimatedWei = maxFeePerGasInWei.multipliedBy(gasLimit).multipliedBy(Web3AtomexProtocolMultiChain.defaultMaxNetworkFeeMultiplier);
    const estimated = web3Helper.convertFromWei(toolkit, estimatedWei, 'ether');
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  protected async getReadonlyWeb3(): Promise<Web3> {
    const toolkit = await this.atomexBlockchainProvider.getReadonlyToolkit<Web3>('web3', this.blockchain);
    if (!toolkit)
      throw new Error('Web3 toolkit not found');

    return toolkit;
  }

  protected async getWallet(address?: string): Promise<BlockchainWallet<Web3>> {
    const web3Wallet = await this.walletsManager.getWallet<Web3>(address, this.blockchain, 'web3');
    if (!web3Wallet)
      throw new Error(`${this.blockchain} Web3 wallet not found`);

    return web3Wallet;
  }

  protected async getTransaction(
    toolkit: Web3,
    type: Transaction['type'],
    receipt: TransactionReceipt
  ): Promise<Transaction> {
    //TODO: Fill all fields
    const currentBlockNumber = await toolkit.eth.getBlockNumber();

    return {
      type,
      currencyId: this.currencyId,
      blockId: receipt.blockNumber,
      id: receipt.transactionHash,
      status: String(receipt.status),
      confirmations: Math.max(currentBlockNumber - receipt.blockNumber, 0)
    };
  }
}
