import BigNumber from 'bignumber.js';

const redeemRewardTokenTestCases: ReadonlyArray<[
  message: string,
  data: {
    nativeTokenPriceInUsd: BigNumber;
    nativeTokenPriceInCurrency: BigNumber;
    redeemFee: BigNumber;
    expectedRedeemReward: BigNumber;
  }
]> = [
    [
      'Simple',
      {
        nativeTokenPriceInUsd: new BigNumber('2.15'),
        nativeTokenPriceInCurrency: new BigNumber('0.00006994'),
        redeemFee: new BigNumber('0.011'),
        expectedRedeemReward: new BigNumber('0.00000153722104634576757136'),
      }
    ],
  ];

export default redeemRewardTokenTestCases;
