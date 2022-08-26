import BigNumber from 'bignumber.js';

import { atomexProtocolV1Utils } from '../../src/blockchain/atomexProtocolV1/index';

describe('Atomex Protocol V1 utils', () => {
  test('return correct redeem reward for native token', () => {
    const nativeTokenPriceInUsd = new BigNumber(2.15);
    const redeemFee = new BigNumber(0.011);
    const redeemReward = atomexProtocolV1Utils.getRedeemRewardInNativeToken(nativeTokenPriceInUsd, redeemFee);
    expect(redeemReward.estimated).toEqual(new BigNumber('0.021979139924875144'));
  });

  test('return correct redeem reward for token', () => {
    const nativeTokenPriceInUsd = new BigNumber(2.15);
    const nativeTokenPriceInCurrency = new BigNumber(0.00006994);
    const redeemFee = new BigNumber(0.011);
    const redeemReward = atomexProtocolV1Utils.getRedeemRewardInToken(nativeTokenPriceInUsd, nativeTokenPriceInCurrency, redeemFee);
    expect(redeemReward.estimated).toEqual(new BigNumber('0.00000153722104634576757136'));
  });
});
