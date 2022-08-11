import Web3 from 'web3';

import type { Atomex } from '../../atomex/index';
import type { AtomexSignature, BlockchainWallet } from '../../blockchain/index';
import type { AtomexNetwork } from '../../common/index';
import { recoverPublicKey } from '../../ethereum/utils/index';

export class Web3BlockchainWallet implements BlockchainWallet<Web3> {
  static readonly signingAlgorithm = 'Keccak256WithEcdsa:Geth2940';

  readonly id = 'web3';
  readonly toolkit: Web3;

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly provider: Web3['currentProvider']
  ) {
    this.toolkit = new Web3(provider);
  }

  async getBlockchain(): Promise<string> {
    const chainId = await this.toolkit.eth.getChainId();
    switch (chainId) {
      case 1:
      case 5:
        return 'ethereum';

      case 56:
      case 97:
        return 'binance';
    }

    return '';
  }

  async getAddress(): Promise<string> {
    const accounts = await this.toolkit.eth.getAccounts();
    const address = accounts[0];
    if (!address)
      throw new Error('Address is unavailable');

    return address;
  }

  getPublicKey() {
    return undefined;
  }

  async sign(message: string): Promise<AtomexSignature> {
    const address = await this.getAddress();

    const signatureBytes = await this.signInternal(message, address);
    const publicKeyBytes = recoverPublicKey(signatureBytes, this.toolkit.eth.accounts.hashMessage(message));

    return {
      address,
      publicKeyBytes: publicKeyBytes.startsWith('0x') ? publicKeyBytes.substring(2) : publicKeyBytes,
      signatureBytes: signatureBytes.substring(signatureBytes.startsWith('0x') ? 2 : 0, signatureBytes.length - 2),
      algorithm: Web3BlockchainWallet.signingAlgorithm
    };
  }

  protected signInternal(message: string, address: string) {
    return new Promise<string>((resolve, reject) => this.toolkit.eth.personal.sign(message, address, '', (error, signature) => {
      return signature ? resolve(signature) : reject(error);
    }));
  }

  static async bind(atomex: Atomex, provider: Web3['currentProvider']): Promise<Web3BlockchainWallet> {
    const wallet = new Web3BlockchainWallet(atomex.atomexNetwork, provider);
    await atomex.wallets.addWallet(wallet);

    return wallet;
  }
}
