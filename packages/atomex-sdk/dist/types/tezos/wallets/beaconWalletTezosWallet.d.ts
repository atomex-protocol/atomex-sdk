import type { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
export declare class BeaconWalletTezosWallet implements BlockchainWallet<TezosToolkit> {
    readonly atomexNetwork: AtomexNetwork;
    readonly beaconWallet: BeaconWallet;
    readonly id = "taquito";
    readonly toolkit: TezosToolkit;
    constructor(atomexNetwork: AtomexNetwork, beaconWallet: BeaconWallet, rpcUrl: string);
    getBlockchain(): string | Promise<string>;
    getAddress(): Promise<string>;
    getPublicKey(): Promise<string | undefined>;
    sign(message: string): Promise<AtomexSignature>;
}
