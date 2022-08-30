import type { AtomexProtocol } from '../atomexProtocol';
import type { AtomexProtocolMultiChain } from './atomexProtocolMultiChain';
import type { AtomexProtocolMultiChainApprovable } from './atomexProtocolMultiChainApprovable';

export const isAtomexProtocolMultiChain = (atomexProtocol: AtomexProtocol): atomexProtocol is AtomexProtocolMultiChain => {
  return atomexProtocol.type === 'multi-chain';
};

export const isAtomexProtocolMultiChainApprovable = (atomexProtocol: AtomexProtocol): atomexProtocol is AtomexProtocolMultiChainApprovable => {
  return atomexProtocol.type === 'multi-chain-approvable';
};
