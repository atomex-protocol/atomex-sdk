import type { Signer } from './signer';
export interface BlockchainToolkitProvider {
    getReadonlyToolkit(blockchain: string, toolkitId: string): Promise<unknown | undefined>;
    getToolkit(blockchain: string, address: string, toolkitId: string): Promise<unknown | undefined>;
    addSigner(signer: Signer): Promise<boolean>;
    removeSigner(signer: Signer): Promise<boolean>;
}
