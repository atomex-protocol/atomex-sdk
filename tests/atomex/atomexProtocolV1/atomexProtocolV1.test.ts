import { atomexProtocolV1Utils } from '../../../src/blockchain/atomexProtocolV1/index';
import { redeemRewardNativeTokenTestCases, redeemRewardTokenTestCases } from './testCases';

describe('Atomex Protocol V1 utils', () => {
  test.each(redeemRewardNativeTokenTestCases)(
    'returns redeem reward for native token (%s: %j)',
    (_, { nativeTokenPriceInUsd, redeemFee, expectedRedeemReward }) => {
      const redeemReward = atomexProtocolV1Utils.getRedeemRewardInNativeToken(nativeTokenPriceInUsd, redeemFee);
      expect(redeemReward.estimated).toEqual(expectedRedeemReward);
    });

  test.each(redeemRewardTokenTestCases)(
    'returns redeem reward for token (%s: %j)',
    (_, { nativeTokenPriceInUsd, redeemFee, nativeTokenPriceInCurrency, expectedRedeemReward }) => {
      const redeemReward = atomexProtocolV1Utils.getRedeemRewardInToken(nativeTokenPriceInUsd, nativeTokenPriceInCurrency, redeemFee);
      expect(redeemReward.estimated).toEqual(expectedRedeemReward);
    });
});
