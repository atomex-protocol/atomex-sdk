import type { AtomexProtocolMultiChainOptions } from '../../blockchain/index';
export interface Web3AtomexProtocolMultiChainOptions extends AtomexProtocolMultiChainOptions {
    initiateOperation: {
        gasLimit: {
            withoutReward: number;
            withReward: number;
        };
    };
    redeemOperation: {
        gasLimit: number;
    };
    refundOperation: {
        gasLimit: number;
    };
    defaultGasPriceInGwei: number;
    maxGasPriceInGwei: number;
}
