import type { BeaconWallet } from '@taquito/beacon-wallet';
import type { TempleWallet } from '@temple-wallet/dapp';

import type { Atomex } from '../../atomex/index';
import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common';
import { BeaconWalletTezosWallet } from './beaconWalletTezosWallet';
import { InMemoryTezosWallet } from './inMemoryTezosWallet';
import { TempleWalletTezosWallet } from './templeWalletTezosWallet';

export class TaquitoBlockchainWallet implements BlockchainWallet {
  protected readonly internalWallet: BlockchainWallet;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly walletOrSecretKey: BeaconWallet | TempleWallet | string,
    readonly rpcUrl: string,
  ) {
    this.internalWallet = this.createInternalWallet(walletOrSecretKey);
  }

  get id() {
    return this.internalWallet.id;
  }

  get toolkit() {
    return this.internalWallet.toolkit;
  }

  getAddress(): string | Promise<string> {
    return this.internalWallet.getAddress();
  }

  getPublicKey(): string | Promise<string | undefined> | undefined {
    return this.internalWallet.getPublicKey();
  }

  getBlockchain(): string | Promise<string> {
    return this.internalWallet.getBlockchain();
  }

  sign(message: string): Promise<AtomexSignature> {
    return this.internalWallet.sign(message);
  }

  protected createInternalWallet(walletOrSecretKey: BeaconWallet | TempleWallet | string): BlockchainWallet {
    if (typeof walletOrSecretKey === 'string')
      return new InMemoryTezosWallet(this.atomexNetwork, (walletOrSecretKey as string), this.rpcUrl);
    else if ((walletOrSecretKey as BeaconWallet).client?.name !== undefined)
      return new BeaconWalletTezosWallet(this.atomexNetwork, (walletOrSecretKey as BeaconWallet), this.rpcUrl);
    else if ((walletOrSecretKey as TempleWallet).permission !== undefined && (walletOrSecretKey as TempleWallet).connected !== undefined)
      return new TempleWalletTezosWallet(this.atomexNetwork, (walletOrSecretKey as TempleWallet), this.rpcUrl);
    else
      throw new Error('Unknown Tezos wallet');
  }

  static async bind(atomex: Atomex, walletOrSecretKey: BeaconWallet | TempleWallet | string): Promise<TaquitoBlockchainWallet> {
    const blockchain = 'tezos';
    const rpcUrl = atomex.atomexContext.providers.blockchainProvider.getNetworkOptions(blockchain)?.rpcUrl;
    if (!rpcUrl)
      throw new Error(`There is not rpc url for ${blockchain} network`);

    const wallet = new TaquitoBlockchainWallet(atomex.atomexNetwork, walletOrSecretKey, rpcUrl);
    await atomex.wallets.addWallet(wallet);

    return wallet;
  }
}
