import type { BlockchainToolkitProvider, Signer } from '../../blockchain/index';

export class TezosBlockchainToolkitProvider implements BlockchainToolkitProvider {
  getReadonlyToolkit(_blockchain: string, _toolkitId: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  getToolkit(_blockchain: string, _address: string, _toolkitId: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  addSigner(_signer: Signer): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  removeSigner(_signer: Signer): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
