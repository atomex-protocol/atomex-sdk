import { AtomexProtocolMultiChainApprovable, atomexProtocolMultiChainHelper } from '../../blockchain/atomexProtocolMultiChain';
import type {
  AtomexBlockchainProvider,
  AtomexProtocolMultiChainInitiateParameters, AtomexProtocolMultiChainRedeemParameters, AtomexProtocolMultiChainRefundParameters,
  FeesInfo, Transaction, WalletsManager
} from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import { Web3AtomexProtocolMultiChain } from '../../evm/index';
import type { PriceManager } from '../../exchange';
import type { ERC20EthereumWeb3AtomexProtocolMultiChainOptions } from '../models/index';

export class ERC20EthereumWeb3AtomexProtocolMultiChain extends Web3AtomexProtocolMultiChain implements AtomexProtocolMultiChainApprovable {
  readonly type = 'MultiChainApprovable';

  constructor(
    atomexNetwork: AtomexNetwork,
    protected readonly atomexProtocolOptions: DeepReadonly<ERC20EthereumWeb3AtomexProtocolMultiChainOptions>,
    atomexBlockchainProvider: AtomexBlockchainProvider,
    walletsManager: WalletsManager,
    priceManager: PriceManager
  ) {
    super('ethereum', atomexNetwork, atomexProtocolOptions, atomexBlockchainProvider, walletsManager, priceManager);
  }

  get currencyId() {
    return this.atomexProtocolOptions.currencyId;
  }

  approve(_params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  initiate(_params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getInitiateFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    return super.getInitiateFees(params);
  }

  redeem(_params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo> {
    return atomexProtocolMultiChainHelper.getRedeemRewardInToken(this.currencyId, redeemFee, this.priceManager, this.atomexBlockchainProvider);
  }

  getRedeemFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    return super.getRedeemFees(params);
  }

  refund(_params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  getRefundFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo> {
    return super.getRefundFees(params);
  }
}
