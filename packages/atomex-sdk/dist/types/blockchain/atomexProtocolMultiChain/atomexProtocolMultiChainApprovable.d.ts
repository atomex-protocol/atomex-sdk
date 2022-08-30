import type { Transaction } from '../models';
import type { AtomexProtocolMultiChainBase } from './base';
import type { AtomexProtocolMultiChainInitiateParameters } from './initiateParameters';
export interface AtomexProtocolMultiChainApprovable extends AtomexProtocolMultiChainBase {
    readonly type: 'multi-chain-approvable';
    approve(params: AtomexProtocolMultiChainInitiateParameters): Promise<Transaction>;
}
