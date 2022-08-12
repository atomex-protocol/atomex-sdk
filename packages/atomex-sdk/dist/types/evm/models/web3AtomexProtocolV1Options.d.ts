import type { AtomexProtocolV1Options } from '../../blockchain/index';
export interface Web3AtomexProtocolV1Options extends AtomexProtocolV1Options {
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
