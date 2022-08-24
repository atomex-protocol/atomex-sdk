import type { AtomexNetwork, AtomexProtocolV1 } from '../../../src/index';

export class MockAtomexProtocolV1 implements AtomexProtocolV1 {
  readonly version = 1;
  constructor(readonly atomexNetwork: AtomexNetwork, readonly currencyId: string) {
  }

  initiate = jest.fn<ReturnType<AtomexProtocolV1['initiate']>, Parameters<AtomexProtocolV1['initiate']>>();
  getInitiateFees = jest.fn<ReturnType<AtomexProtocolV1['getInitiateFees']>, Parameters<AtomexProtocolV1['getInitiateFees']>>();
  redeem = jest.fn<ReturnType<AtomexProtocolV1['redeem']>, Parameters<AtomexProtocolV1['redeem']>>();
  getRedeemFees = jest.fn<ReturnType<AtomexProtocolV1['getRedeemFees']>, Parameters<AtomexProtocolV1['getRedeemFees']>>();
  getRedeemReward = jest.fn<ReturnType<AtomexProtocolV1['getRedeemReward']>, Parameters<AtomexProtocolV1['getRedeemReward']>>();
  refund = jest.fn<ReturnType<AtomexProtocolV1['refund']>, Parameters<AtomexProtocolV1['refund']>>();
  getRefundFees = jest.fn<ReturnType<AtomexProtocolV1['getRefundFees']>, Parameters<AtomexProtocolV1['getRefundFees']>>();
}
