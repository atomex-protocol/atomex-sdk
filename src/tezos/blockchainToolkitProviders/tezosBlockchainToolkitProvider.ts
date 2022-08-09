import { TezosToolkit, WalletProvider } from '@taquito/taquito';

import type { BlockchainToolkitProvider, Signer } from '../../blockchain/index';
import { BeaconWalletTezosSigner } from '../walletTezosSigner/beaconWalletTezosSigner';
import { WalletTezosSigner } from '../walletTezosSigner/index';
import { TempleWalletTezosSigner } from '../walletTezosSigner/templeWalletTezosSigner';

export class TezosBlockchainToolkitProvider implements BlockchainToolkitProvider {
  readonly toolkitId = 'tezosToolkit';

  protected readonlyToolkit: TezosToolkit | undefined;
  protected toolkit: TezosToolkit | undefined;

  constructor(
    protected readonly rpcUrl: string
  ) { }

  getReadonlyToolkit(): Promise<unknown> {
    if (!this.readonlyToolkit)
      this.readonlyToolkit = this.createToolkit();

    return Promise.resolve(this.readonlyToolkit);
  }

  async getToolkit(address: string): Promise<unknown | undefined> {
    const toolkitAddress = await this.toolkit?.wallet.pkh();

    return toolkitAddress && toolkitAddress[0] === address
      ? this.toolkit
      : undefined;
  }

  async addSigner(signer: Signer): Promise<boolean> {
    const walletProvider = this.getWalletProvider(signer);
    if (!walletProvider)
      return false;

    this.toolkit = this.createToolkit();
    this.toolkit.setWalletProvider(walletProvider);

    return true;
  }

  async removeSigner(signer: Signer): Promise<boolean> {
    const walletProvider = this.getWalletProvider(signer);
    if (!walletProvider)
      return false;

    this.toolkit = undefined;

    return true;
  }

  protected getWalletProvider(signer: Signer): WalletProvider | undefined {
    let walletProvider: WalletProvider | undefined;

    if (signer instanceof WalletTezosSigner)
      walletProvider = signer.wallet;
    else if (signer instanceof BeaconWalletTezosSigner)
      walletProvider = signer.beaconWallet;
    else if (signer instanceof TempleWalletTezosSigner)
      walletProvider = signer.templeWallet;

    return walletProvider;
  }

  protected createToolkit(): TezosToolkit {
    return new TezosToolkit(this.rpcUrl);
  }
}
