import type { AtomexProtocolMultiChainBase } from './base';

export interface AtomexProtocolMultiChain extends AtomexProtocolMultiChainBase {
  readonly type: 'multi-chain';
}
