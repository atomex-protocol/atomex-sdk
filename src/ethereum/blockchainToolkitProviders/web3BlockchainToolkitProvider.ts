import Web3 from 'web3';

import type { BlockchainToolkitProvider, Signer } from '../../blockchain/index';
import { Web3EthereumSigner } from '../index';

export class Web3BlockchainToolkitProvider implements BlockchainToolkitProvider {
  readonly toolkitId = 'web3';
  
  protected readonlyToolkit: Web3 | undefined;
  protected toolkit: Web3 | undefined;

  constructor(
    protected readonly rpcUrl: string
  ) { }

  getReadonlyToolkit(): Promise<unknown | undefined> {
    if (!this.readonlyToolkit)
      this.readonlyToolkit = new Web3(this.rpcUrl);

    return Promise.resolve(this.readonlyToolkit);
  }

  async getToolkit(address: string): Promise<unknown | undefined> {
    const toolkitAccounts = await this.toolkit?.eth.getAccounts();

    return toolkitAccounts && toolkitAccounts[0] === address
      ? this.toolkit
      : undefined;
  }

  async addSigner(signer: Signer): Promise<boolean> {
    if (!(signer instanceof Web3EthereumSigner))
      return false;

    this.readonlyToolkit = new Web3(signer.provider);

    return true;
  }

  async removeSigner(signer: Signer): Promise<boolean> {
    if (!(signer instanceof Web3EthereumSigner))
      return false;

    this.readonlyToolkit = undefined;

    return true;
  }
}
