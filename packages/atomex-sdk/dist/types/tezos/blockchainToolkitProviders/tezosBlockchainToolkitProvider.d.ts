import type { BlockchainToolkitProvider, Signer } from '../../blockchain/index';
export declare class TezosBlockchainToolkitProvider implements BlockchainToolkitProvider {
    getReadonlyToolkit(_blockchain: string, _toolkitId: string): Promise<unknown>;
    getToolkit(_blockchain: string, _address: string, _toolkitId: string): Promise<unknown>;
    addSigner(_signer: Signer): Promise<boolean>;
    removeSigner(_signer: Signer): Promise<boolean>;
}
