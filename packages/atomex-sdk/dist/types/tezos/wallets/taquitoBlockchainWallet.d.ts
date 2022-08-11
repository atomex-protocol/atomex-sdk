import type { BeaconWallet } from '@taquito/beacon-wallet';
import type { TempleWallet } from '@temple-wallet/dapp';
import type { Atomex } from '../../atomex/index';
import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common';
export declare class TaquitoBlockchainWallet implements BlockchainWallet {
    readonly atomexNetwork: AtomexNetwork;
    readonly walletOrSecretKey: BeaconWallet | TempleWallet | string;
    readonly rpcUrl: string;
    protected readonly internalWallet: BlockchainWallet;
    constructor(atomexNetwork: AtomexNetwork, walletOrSecretKey: BeaconWallet | TempleWallet | string, rpcUrl: string);
    get id(): string;
    get toolkit(): unknown;
    getAddress(): string | Promise<string>;
    getPublicKey(): string | Promise<string | undefined> | undefined;
    getBlockchain(): string | Promise<string>;
    sign(message: string): Promise<AtomexSignature>;
    protected createInternalWallet(walletOrSecretKey: BeaconWallet | TempleWallet | string): BlockchainWallet;
    static bind(atomex: Atomex, walletOrSecretKey: BeaconWallet | TempleWallet | string): Promise<TaquitoBlockchainWallet>;
}
