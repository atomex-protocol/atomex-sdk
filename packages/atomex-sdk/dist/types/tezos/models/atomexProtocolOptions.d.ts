import type { AtomexProtocolMultiChainOptions } from '../../blockchain/index';
export interface TaquitoAtomexProtocolMultiChainOptions extends AtomexProtocolMultiChainOptions {
    initiateOperation: {
        fee: number;
        gasLimit: number;
        storageLimit: number;
    };
    redeemOperation: {
        fee: number;
        gasLimit: number;
        storageLimit: number;
    };
    refundOperation: {
        fee: number;
        gasLimit: number;
        storageLimit: number;
    };
}
export declare type TezosTaquitoAtomexProtocolMultiChainOptions = TaquitoAtomexProtocolMultiChainOptions;
export declare type FA12TezosTaquitoAtomexProtocolMultiChainOptions = TezosTaquitoAtomexProtocolMultiChainOptions;
export declare type FA2TezosTaquitoAtomexProtocolMultiChainOptions = TezosTaquitoAtomexProtocolMultiChainOptions;
