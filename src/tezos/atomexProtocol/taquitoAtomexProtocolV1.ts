import type { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import type {
  AtomexBlockchainProvider,
  AtomexProtocolV1, AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
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

  abstract initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction>;

  getEstimatedInitiateFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    const fee = new BigNumber(this.atomexProtocolOptions.initiateOperation.fee).div(mutezInTez);

    return Promise.resolve(fee);
  }

  abstract redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction>;

  abstract getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<BigNumber>;

  getEstimatedRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    const fee = new BigNumber(this.atomexProtocolOptions.redeemOperation.fee).div(mutezInTez);

    return Promise.resolve(fee);
  }

  abstract refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction>;

  getEstimatedRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    const fee = new BigNumber(this.atomexProtocolOptions.refundOperation.fee).div(mutezInTez);

    return Promise.resolve(fee);
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
