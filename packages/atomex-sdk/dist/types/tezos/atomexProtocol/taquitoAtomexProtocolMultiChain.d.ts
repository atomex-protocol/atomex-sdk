import type { TezosToolkit } from '@taquito/taquito';
import type { AtomexBlockchainProvider, AtomexProtocolMultiChain, FeesInfo, AtomexProtocolMultiChainInitiateParameters, AtomexProtocolMultiChainRedeemParameters, AtomexProtocolMultiChainRefundParameters, BlockchainWallet, Transaction, WalletsManager } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { PriceManager } from '../../exchange';
import type { TaquitoAtomexProtocolMultiChainOptions } from '../models/index';
export declare abstract class TaquitoAtomexProtocolMultiChain implements AtomexProtocolMultiChain {
    protected readonly blockchain: string;
    readonly atomexNetwork: AtomexNetwork;
    protected readonly atomexProtocolOptions: DeepReadonly<TaquitoAtomexProtocolMultiChainOptions>;
    protected readonly atomexBlockchainProvider: AtomexBlockchainProvider;
    protected readonly walletsManager: WalletsManager;
    protected readonly priceManager: PriceManager;
    readonly type = "multi-chain";
    constructor(blockchain: string, atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<TaquitoAtomexProtocolMultiChainOptions>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager, priceManager: PriceManager);
    get currencyId(): string;
    get swapContractAddress(): string;
    abstract initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
    getInitiateFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
    abstract redeem(params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction>;
    abstract getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
    getRedeemFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
    abstract refund(params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction>;
    getRefundFees(_params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
    protected getReadonlyTezosToolkit(): Promise<TezosToolkit>;
    protected getWallet(address?: string): Promise<BlockchainWallet<TezosToolkit>>;
}
