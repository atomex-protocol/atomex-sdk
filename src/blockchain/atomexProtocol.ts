import type { AtomexNetwork } from '../index';

export interface AtomexProtocol {
  readonly version: number;
  readonly network: AtomexNetwork;
}
