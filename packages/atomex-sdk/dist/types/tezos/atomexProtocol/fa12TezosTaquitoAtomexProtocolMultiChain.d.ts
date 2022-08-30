import type { AtomexBlockchainProvider, AtomexProtocolMultiChainInitiateParameters, AtomexProtocolMultiChainRedeemParameters, AtomexProtocolMultiChainRefundParameters, FeesInfo, Transaction, WalletsManager } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import type { DeepReadonly } from '../../core/index';
import type { PriceManager } from '../../exchange';
import type { FA12TezosTaquitoAtomexProtocolMultiChainOptions } from '../models/index';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';
export declare class FA12TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain {
    protected readonly atomexProtocolOptions: DeepReadonly<FA12TezosTaquitoAtomexProtocolMultiChainOptions>;
    constructor(atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<FA12TezosTaquitoAtomexProtocolMultiChainOptions>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager, priceManager: PriceManager);
    get currencyId(): string;
    initiate(_params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
    getInitiateFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
    redeem(_params: AtomexProtocolMultiChainRedeemParameters): Promise<Transaction>;
    getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
    getRedeemFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
    refund(_params: AtomexProtocolMultiChainRefundParameters): Promise<Transaction>;
    getRefundFees(params: Partial<AtomexProtocolMultiChainInitiateParameters>): Promise<FeesInfo>;
}
