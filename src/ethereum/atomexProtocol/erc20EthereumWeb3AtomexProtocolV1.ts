import type BigNumber from 'bignumber.js';

import type {
  AtomexBlockchainProvider,
  AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import { Web3AtomexProtocolV1 } from '../../evm/index';
import type { ERC20EthereumWeb3AtomexProtocolV1Options } from '../models/index';

export class ERC20EthereumWeb3AtomexProtocolV1 extends Web3AtomexProtocolV1 {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<ERC20EthereumWeb3AtomexProtocolV1Options>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager
  ) {
    super('ethereum', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager);
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getEstimatedInitiateFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRedeemReward(_nativeTokenPriceInUsd: number, _nativeTokenPriceInCurrency: number): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  getEstimatedRedeemFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }

  refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getEstimatedRefundFees(_params: Partial<AtomexProtocolV1InitiateParameters>): Promise<BigNumber> {
    throw new Error('Method not implemented.');
  }
}
