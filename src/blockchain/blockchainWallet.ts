import type { AtomexNetwork } from '../common';
import type { AtomexSignature } from './models';

export interface BlockchainWallet<T = unknown> {
  readonly atomexNetwork: AtomexNetwork;
  readonly id: string;
  get toolkit(): T;

  getBlockchain(): Promise<string> | string;
  getAddress(): Promise<string> | string;
  getPublicKey(): Promise<string | undefined> | string | undefined;

  sign(message: string): Promise<AtomexSignature>;
}
