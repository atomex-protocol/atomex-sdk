import type { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import type {
  AtomexBlockchainProvider,
  AtomexProtocolV1, FeesInfo, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  BlockchainWallet, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { TaquitoAtomexProtocolV1Options } from '../models/index';
import { mutezInTez } from '../utils';

export abstract class TaquitoAtomexProtocolV1 implements AtomexProtocolV1 {
  readonly version = 1;

  constructor(
    protected readonly blockchain: string,
    readonly atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<TaquitoAtomexProtocolV1Options>,
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider,
    protected readonly walletsManager: WalletsManager
  ) {
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  get swapContractAddress() {
    return this.atomexProtocolOptions.swapContractAddress;
  }

  abstract initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;

  getInitiateFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    const estimated = new BigNumber(this.atomexProtocolOptions.initiateOperation.fee).div(mutezInTez);
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  abstract redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;

  abstract getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<FeesInfo>;

  getRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    const estimated = new BigNumber(this.atomexProtocolOptions.redeemOperation.fee).div(mutezInTez);
    const result: FeesInfo = { estimated, max: estimated };

    return Promise.resolve(result);
  }

  abstract refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction>;

  getRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
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
