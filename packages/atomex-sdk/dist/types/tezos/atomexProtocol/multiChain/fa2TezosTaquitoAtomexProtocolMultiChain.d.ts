import type { AtomexBlockchainProvider, AtomexProtocolMultiChainInitiateParameters, FeesInfo, Transaction, WalletsManager } from '../../../blockchain/index';
import type { AtomexNetwork } from '../../../common/index';
import type { DeepReadonly } from '../../../core/index';
import type { PriceManager } from '../../../exchange/index';
import type { FA2TezosTaquitoAtomexProtocolMultiChainOptions } from '../../models/index';
import { TaquitoAtomexProtocolMultiChain } from './taquitoAtomexProtocolMultiChain';
export declare class FA2TezosTaquitoAtomexProtocolMultiChain extends TaquitoAtomexProtocolMultiChain {
    protected readonly atomexProtocolOptions: DeepReadonly<FA2TezosTaquitoAtomexProtocolMultiChainOptions>;
    constructor(atomexNetwork: AtomexNetwork, atomexProtocolOptions: DeepReadonly<FA2TezosTaquitoAtomexProtocolMultiChainOptions>, atomexBlockchainProvider: AtomexBlockchainProvider, walletsManager: WalletsManager, priceManager: PriceManager);
    initiate(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
    getRedeemReward(redeemFee: FeesInfo): Promise<FeesInfo>;
}
