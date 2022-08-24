import BigNumber from 'bignumber.js';
import type Web3 from 'web3';

import type {
  AtomexBlockchainProvider,
  AtomexProtocolV1, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  BlockchainWallet, FeesInfo, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import { web3Helper } from '../helpers';
import type { Web3AtomexProtocolV1Options } from '../models/index';

export abstract class Web3AtomexProtocolV1 implements AtomexProtocolV1 {
  protected static maxNetworkFeeMultiplier = new BigNumber(1.2);
  readonly version = 1;

  constructor(
    protected readonly blockchain: string,
    readonly atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<Web3AtomexProtocolV1Options>,
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider,
    protected readonly walletsManager: WalletsManager
  ) {
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  abstract initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;

  async getInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    const toolkit = await this.getReadonlyWeb3();
    const gasPriceInWei = await web3Helper.getGasPriceInWei(toolkit);
    const gasLimitOptions = this.atomexProtocolOptions.initiateOperation.gasLimit;
    const hasRewardForRedeem = params.rewardForRedeem?.isGreaterThan(0);
    const gasLimit = new BigNumber(hasRewardForRedeem ? gasLimitOptions.withReward : gasLimitOptions.withoutReward);

    const estimatedWei = gasPriceInWei.multipliedBy(gasLimit).multipliedBy(Web3AtomexProtocolV1.maxNetworkFeeMultiplier);
    const estimated = web3Helper.convertFromWei(toolkit, estimatedWei, 'ether');
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  abstract redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;

  abstract getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<FeesInfo>;

  async getRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    const toolkit = await this.getReadonlyWeb3();
    const gasPriceInWei = await web3Helper.getGasPriceInWei(toolkit);
    const gasLimit = this.atomexProtocolOptions.redeemOperation.gasLimit;

    const estimatedWei = gasPriceInWei.multipliedBy(gasLimit).multipliedBy(Web3AtomexProtocolV1.maxNetworkFeeMultiplier);
    const estimated = web3Helper.convertFromWei(toolkit, estimatedWei, 'ether');
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  abstract refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction>;

  async getRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    const toolkit = await this.getReadonlyWeb3();
    const gasPriceInWei = await web3Helper.getGasPriceInWei(toolkit);
    const gasLimit = this.atomexProtocolOptions.refundOperation.gasLimit;

    const estimatedWei = gasPriceInWei.multipliedBy(gasLimit).multipliedBy(Web3AtomexProtocolV1.maxNetworkFeeMultiplier);
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
}
