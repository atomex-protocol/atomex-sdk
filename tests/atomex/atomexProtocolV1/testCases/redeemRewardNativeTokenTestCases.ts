import BigNumber from 'bignumber.js';

const redeemRewardNativeTokenTestCases: ReadonlyArray<[
  message: string,
  data: {
    nativeTokenPriceInUsd: BigNumber;
    redeemFee: BigNumber;
    expectedRedeemReward: BigNumber;
  }
]> = [
    [
      'Simple',
      {
        nativeTokenPriceInUsd: new BigNumber('2.15'),
        redeemFee: new BigNumber('0.011'),
        expectedRedeemReward: new BigNumber('0.021979139924875144'),
      }
    ],
  ];

export default redeemRewardNativeTokenTestCases;
