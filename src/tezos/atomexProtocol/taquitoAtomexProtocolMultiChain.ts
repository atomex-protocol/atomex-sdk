import type { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChain, FeesInfo, AtomexProtocolMultiChainInitiateParameters, AtomexProtocolMultiChainRedeemParameters, AtomexProtocolMultiChainRefundParameters,
  BlockchainWallet, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { PriceManager } from '../../exchange';
import type { TaquitoAtomexProtocolMultiChainOptions } from '../models/index';
import { mutezInTez } from '../utils';

export abstract class TaquitoAtomexProtocolMultiChain implements AtomexProtocolMultiChain {
  readonly type = 'multi-chain';

  constructor(
    protected readonly blockchain: string,
    readonly atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<TaquitoAtomexProtocolMultiChainOptions>,
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider,
    protected readonly walletsManager: WalletsManager,
    protected readonly priceManager: PriceManager
  ) {
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  get swapContractAddress() {
    return this.atomexProtocolOptions.swapContractAddress;
  }

  abstract initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;

  getInitiateFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    const estimated = new BigNumber(this.atomexProtocolOptions.initiateOperation.fee).div(mutezInTez);
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  abstract redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction>;

  abstract getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;

  getRedeemFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    const estimated = new BigNumber(this.atomexProtocolOptions.redeemOperation.fee).div(mutezInTez);
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  abstract refund(params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction>;

  getRefundFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    const estimated = new BigNumber(this.atomexProtocolOptions.refundOperation.fee).div(mutezInTez);
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  protected async getReadonlyTezosToolkit(): Promise<TezosToolkit> {
    const toolkit = await this.atomexBlockchainProvider.getReadonlyToolkit<TezosToolkit>('taquito', this.blockchain);
    if (!toolkit)
      throw new Error('Tezos toolkit not found');

    return toolkit;
  }

  protected async getWallet(address?: string): Promise<BlockchainWallet<TezosToolkit>> {
    const taquitoWallet = await this.walletsManager.getWallet<TezosToolkit>(address, this.blockchain, 'taquito');
    if (!taquitoWallet)
      throw new Error(`${this.blockchain} Taqutio wallet not found`);

    return taquitoWallet;
  }
}
