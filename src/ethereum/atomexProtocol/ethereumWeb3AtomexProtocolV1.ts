import type BigNumber from 'bignumber.js';

import type {
  AtomexBlockchainProvider,
  AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import { Web3AtomexProtocolV1 } from '../../evm/index';
import type { EthereumWeb3AtomexProtocolV1Options } from '../models/index';

export class EthereumWeb3AtomexProtocolV1 extends Web3AtomexProtocolV1 {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<EthereumWeb3AtomexProtocolV1Options>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager
  ) {
    super('ethereum', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
  }

  initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  async getInitiateFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    throw new Error('Method not implemented.');
  }

  redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  getRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    throw new Error('Method not implemented.');
  }

  refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    throw new Error('Method not implemented.');
  }
}
