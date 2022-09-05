import type { AtomexBlockchainProvider, AtomexProtocolMultiChainInitiateParameters, FeesInfo, Transaction, WalletsManager } from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import type { PriceManager } from '../../../exchange';
import type { FA12TezosTaquitoAtomexProtocolMultiChainOptions } from '../../models/index';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';
export declare class FA12TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain {
    protected readonly atomexProtocolOptions: DeepReadonly<FA12TezosTaquitoAtomexProtocolMultiChainOptions>;
    constructor(atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<FA12TezosTaquitoAtomexProtocolMultiChainOptions>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager, priceManager: PriceManager);
    initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
    getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
}
