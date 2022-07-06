import type { AtomexNetwork } from '../common/index';

export interface AtomexProtocol {
  readonly version: number;
  readonly network: AtomexNetwork;
}
