import { AtomexProtocolMultiChain } from '../../../blockchain/atomexProtocolMultiChain';
import type { AtomexBlockchainProvider, AtomexProtocolMultiChainInitiateParameters, AtomexProtocolMultiChainRedeemParameters, AtomexProtocolMultiChainRefundParameters, FeesInfo, Transaction, WalletsManager } from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import { Web3AtomexProtocolMultiChain } from '../../../evm/index';
import type { PriceManager } from '../../../exchange';
import type { EthereumWeb3AtomexProtocolMultiChainOptions } from '../../models/index';
export declare class EthereumWeb3AtomexProtocolMultiChain extends Web3AtomexProtocolMultiChain implements AtomexProtocolMultiChain {
    protected readonly atomexProtocolOptions: DeepReadonly<EthereumWeb3AtomexProtocolMultiChainOptions>;
    readonly type = "multi-chain";
    constructor(atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<EthereumWeb3AtomexProtocolMultiChainOptions>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager, priceManager: PriceManager);
    initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
    redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction>;
    getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
    refund(params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction>;
}
