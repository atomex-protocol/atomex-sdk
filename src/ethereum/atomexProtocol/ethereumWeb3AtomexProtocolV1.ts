import { atomexProtocolV1Helper } from '../../blockchain/atomexProtocolV1';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolV1InitiateParameters, AtomexProtocolV1RedeemParameters, AtomexProtocolV1RefundParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import { Web3AtomexProtocolV1 } from '../../evm/index';
import type { PriceManager } from '../../exchange';
import type { EthereumWeb3AtomexProtocolV1Options } from '../models/index';

export class EthereumWeb3AtomexProtocolV1 extends Web3AtomexProtocolV1 {
  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<EthereumWeb3AtomexProtocolV1Options>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager,
    priceManager: PriceManager
  ) {
    super('ethereum', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager, priceManager);
  }

  initiate(_params: AtomexProtocolV1InitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getInitiateFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    return super.getInitiateFees(params);
  }

  redeem(_params: AtomexProtocolV1RedeemParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo> {
    return atomexProtocolV1Helper.getRedeemRewardInNativeCurrency(this.currencyId, redeemFee, this.priceManager);
  }

  getRedeemFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    return super.getRedeemFees(params);
  }

  refund(_params: AtomexProtocolV1RefundParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRefundFees(params: Partial<AtomexProtocolV1InitiateParameters>): Promise<FeesInfo> {
    return super.getRefundFees(params);
  }
}
