import Web3 from 'web3';

import type { BlockchainToolkitProvider } from '../../blockchain/index';

export class Web3BlockchainToolkitProvider implements BlockchainToolkitProvider<Web3> {
  readonly toolkitId = 'web3';

  protected toolkit: Web3 | undefined;

  constructor(
    protected readonly blockchain: string,
    protected readonly rpcUrl: string
  ) { }

  getReadonlyToolkit(blockchain?: string): Promise<Web3 | undefined> {
    if (blockchain && blockchain !== this.blockchain)
      return Promise.resolve(undefined);

    if (!this.toolkit)
      this.toolkit = new Web3(this.rpcUrl);

    return Promise.resolve(this.toolkit);
  }
}
