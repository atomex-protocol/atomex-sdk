import { TezosToolkit } from '@taquito/taquito';
import type { TempleWallet } from '@temple-wallet/dapp';
import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
export declare class TempleWalletTezosWallet implements BlockchainWallet<TezosToolkit> {
    readonly atomexNetwork: AtomexNetwork;
    readonly templeWallet: TempleWallet;
    readonly id = "taquito";
    readonly blockchain = "tezos";
    readonly toolkit: TezosToolkit;
    constructor(atomexNetwork: AtomexNetwork, templeWallet: TempleWallet, rpcUrl: string);
    getBlockchain(): string | Promise<string>;
    getAddress(): Promise<string>;
    getPublicKey(): string | undefined;
    sign(message: string): Promise<AtomexSignature>;
}
