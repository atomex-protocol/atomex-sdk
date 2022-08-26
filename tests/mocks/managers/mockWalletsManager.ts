import { BlockchainWallet, WalletsManager } from '../../../src';

export class MockWalletsManager extends WalletsManager {
  addWallet = jest.fn<ReturnType<WalletsManager['addWallet']>, Parameters<WalletsManager['addWallet']>>();
  removeWallet = jest.fn<ReturnType<WalletsManager['removeWallet']>, Parameters<WalletsManager['removeWallet']>>();

  getWalletMock = jest.fn<ReturnType<WalletsManager['getWallet']>, Parameters<WalletsManager['getWallet']>>();
  getWallet<Toolkit = unknown>(address?: string, blockchain?: string, toolkit?: string): Promise<BlockchainWallet<Toolkit> | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.getWalletMock(address, blockchain, toolkit) as any;
  }
}
