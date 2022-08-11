import type { AtomexNetwork } from '../common/index';
import { atomexUtils } from '../utils/index';
import type { BlockchainWallet } from './blockchainWallet';

export class WalletsManager {
  private readonly wallets: Set<BlockchainWallet> = new Set();

  constructor(readonly atomexNetwork: AtomexNetwork) {
  }

  addWallet(wallet: BlockchainWallet): Promise<BlockchainWallet> {
    atomexUtils.ensureNetworksAreSame(this, wallet);
    this.wallets.add(wallet);

    return Promise.resolve(wallet);
  }

  async removeWallet(wallet: BlockchainWallet): Promise<boolean> {
    const result = this.wallets.delete(wallet);

    return Promise.resolve(result);
  }

  async getWallet(address?: string, blockchain?: string, toolkit?: string): Promise<BlockchainWallet | undefined> {
    if (!this.wallets.size || (!address && !blockchain && !toolkit))
      return undefined;

    const walletPromises: Array<Promise<[wallet: BlockchainWallet, address: string | undefined, blockchain: string | undefined]>> = [];

    for (const wallet of this.wallets) {
      if (toolkit && wallet.id !== toolkit)
        continue;

      const addressPromise = address ? wallet.getAddress() : undefined;
      const blockchainPromise = blockchain ? wallet.getBlockchain() : undefined;

      walletPromises.push(Promise.all([addressPromise, blockchainPromise]).then(([address, blockchain]) => [wallet, address, blockchain]));
    }

    const walletResults = await Promise.allSettled(walletPromises);
    for (const walletResult of walletResults) {
      if (walletResult.status !== 'fulfilled') {
        // TODO: warning if status === 'rejected'
        continue;
      }

      const [wallet, walletAddress, walletBlockchain] = walletResult.value;
      if (!address || address === walletAddress && !blockchain || blockchain == walletBlockchain)
        return wallet;
    }

    return undefined;
  }
}
