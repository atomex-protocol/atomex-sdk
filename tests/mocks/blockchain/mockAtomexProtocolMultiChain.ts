import type { AtomexProtocolMultiChainOptions } from '../../../src/blockchain';
import type { DeepReadonly } from '../../../src/core';
import type { AtomexNetwork, AtomexProtocolMultiChain } from '../../../src/index';

export class MockAtomexProtocolMultiChain implements AtomexProtocolMultiChain {
  readonly type = 'multi-chain';

  constructor(
    readonly atomexNetwork: AtomexNetwork,
    readonly options: DeepReadonly<AtomexProtocolMultiChainOptions>
  ) {
  }

  get currencyId() {
    return this.options.currencyId;
  }

  get swapContractAddress() {
    return this.options.swapContractAddress;
  }

  initiate = jest.fn<ReturnType<AtomexProtocolMultiChain['initiate']>, Parameters<AtomexProtocolMultiChain['initiate']>>();
  getInitiateFees = jest.fn<ReturnType<AtomexProtocolMultiChain['getInitiateFees']>, Parameters<AtomexProtocolMultiChain['getInitiateFees']>>();
  redeem = jest.fn<ReturnType<AtomexProtocolMultiChain['redeem']>, Parameters<AtomexProtocolMultiChain['redeem']>>();
  getRedeemFees = jest.fn<ReturnType<AtomexProtocolMultiChain['getRedeemFees']>, Parameters<AtomexProtocolMultiChain['getRedeemFees']>>();
  getRedeemReward = jest.fn<ReturnType<AtomexProtocolMultiChain['getRedeemReward']>, Parameters<AtomexProtocolMultiChain['getRedeemReward']>>();
  refund = jest.fn<ReturnType<AtomexProtocolMultiChain['refund']>, Parameters<AtomexProtocolMultiChain['refund']>>();
  getRefundFees = jest.fn<ReturnType<AtomexProtocolMultiChain['getRefundFees']>, Parameters<AtomexProtocolMultiChain['getRefundFees']>>();
}
