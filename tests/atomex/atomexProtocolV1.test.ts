import BigNumber from 'bignumber.js';

import { getRedeemRewardInNativeToken, getRedeemRewardInToken, } from '../../src/blockchain/atomexProtocolV1/index';

describe('Atomex | Atomex Protocol V1', () => {
  test('return correct redeem reward for native token', () => {
    const nativeTokenPriceInUsd = new BigNumber(2.15);
    const redeemFee = new BigNumber(0.011);
    const redeemReward = getRedeemRewardInNativeToken(nativeTokenPriceInUsd, redeemFee);
    expect(redeemReward.estimated).toEqual(new BigNumber('0.021979139924875144'));
  });

  test('return correct redeem reward for token', () => {
    const nativeTokenPriceInUsd = new BigNumber(2.15);
    const nativeTokenPriceInCurrency = new BigNumber(0.00006994);
    const redeemFee = new BigNumber(0.011);
    const redeemReward = getRedeemRewardInToken(nativeTokenPriceInUsd, nativeTokenPriceInCurrency, redeemFee);
    expect(redeemReward.estimated).toEqual(new BigNumber('0.00000153722104634576757136'));
  });
});
