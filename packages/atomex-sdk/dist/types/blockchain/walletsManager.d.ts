import type { AtomexNetwork } from '../common/index';
import type { BlockchainWallet } from './blockchainWallet';
export declare class WalletsManager {
    readonly atomexNetwork: AtomexNetwork;
    private readonly wallets;
    constructor(atomexNetwork: AtomexNetwork);
    addWallet(wallet: BlockchainWallet): Promise<BlockchainWallet>;
    removeWallet(wallet: BlockchainWallet): Promise<boolean>;
    getWallet<Toolkit = unknown>(address?: string, blockchain?: string, toolkit?: string): Promise<BlockchainWallet<Toolkit> | undefined>;
}
