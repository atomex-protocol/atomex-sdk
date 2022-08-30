import type { AtomexProtocol } from '../atomexProtocol';
import type { AtomexProtocolMultiChain } from './atomexProtocolMultiChain';

export const isAtomexProtocolMultiChain = (atomexProtocol: AtomexProtocol): atomexProtocol is AtomexProtocolMultiChain => {
  return atomexProtocol.type === 'MultiChain';
};
