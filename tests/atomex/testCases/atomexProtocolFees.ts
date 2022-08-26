import BigNumber from 'bignumber.js';

import type { FeesInfo } from '../../../src/blockchain';

export type AtomexProtocolV1Fees = {
  [currencyId: string]: {
    initiateFees: FeesInfo;
    redeemFees: FeesInfo;
    refundFees: FeesInfo;
    redeemReward: FeesInfo;
  }
};

export const validAtomexProtocolV1Fees = [
  {
    ETH: {
      initiateFees: { estimated: new BigNumber('0.00525'), max: new BigNumber('0.009') },
      redeemFees: { estimated: new BigNumber('0.0023'), max: new BigNumber('0.003') },
      refundFees: { estimated: new BigNumber('0.0017'), max: new BigNumber('0.002') },
      redeemReward: { estimated: new BigNumber('0.0035'), max: new BigNumber('0.0035') },
    },
    XTZ: {
      initiateFees: { estimated: new BigNumber('0.0743'), max: new BigNumber('0.1') },
      redeemFees: { estimated: new BigNumber('0.05'), max: new BigNumber('0.07') },
      refundFees: { estimated: new BigNumber('0.03'), max: new BigNumber('0.04') },
      redeemReward: { estimated: new BigNumber('0.11'), max: new BigNumber('0.11') },
    },
    USDT_XTZ: {
      initiateFees: { estimated: new BigNumber('0.1043'), max: new BigNumber('0.13') },
      redeemFees: { estimated: new BigNumber('0.08'), max: new BigNumber('0.1') },
      refundFees: { estimated: new BigNumber('0.06'), max: new BigNumber('0.07') },
      redeemReward: { estimated: new BigNumber('0.217'), max: new BigNumber('0.217') },
    }
  } as AtomexProtocolV1Fees
] as const;
