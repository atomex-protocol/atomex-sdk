import { TezosToolkit } from '@taquito/taquito';

import type { BlockchainToolkitProvider } from '../../blockchain/index';

export class TaquitoBlockchainToolkitProvider implements BlockchainToolkitProvider {
  static readonly BLOCKCHAIN = 'tezos';

  readonly toolkitId = 'taquito';
  protected toolkit: TezosToolkit | undefined;

  constructor(
    protected readonly rpcUrl: string
  ) { }

  getReadonlyToolkit(blockchain?: string): Promise<TezosToolkit | undefined> {
    if (blockchain && blockchain !== TaquitoBlockchainToolkitProvider.BLOCKCHAIN)
      return Promise.resolve(undefined);

    if (!this.toolkit)
      this.toolkit = new TezosToolkit(this.rpcUrl);

    return Promise.resolve(this.toolkit);
  }
}
