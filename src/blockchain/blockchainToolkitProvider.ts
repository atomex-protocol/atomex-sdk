import type { Signer } from './signer';

export interface BlockchainToolkitProvider {
  readonly toolkitId: string;

  getReadonlyToolkit(): Promise<unknown | undefined>;
  getToolkit(address?: string): Promise<unknown | undefined>;

  addSigner(signer: Signer): Promise<boolean>;
  removeSigner(signer: Signer): Promise<boolean>;
}
