import type BigNumber from 'bignumber.js';

import type { FeesInfo } from '../models/index';

export const getRedeemRewardInNativeToken = (nativeTokenPriceInUsd: BigNumber, redeemFee: BigNumber): FeesInfo => {
  const maxRewardPercentValue = 30;
  const maxRewardPercent = 0.15;
  const maxRewardForRedeemDeviation = 0.05;

  const redeemFeeInUsd = redeemFee.multipliedBy(nativeTokenPriceInUsd);
  const k = maxRewardPercentValue / Math.log((1 - maxRewardPercent) / maxRewardForRedeemDeviation);
  const p = (1 - maxRewardPercent) / Math.exp(redeemFeeInUsd.toNumber() / k) + maxRewardPercent;

  const rewardForRedeem = redeemFee.multipliedBy(1 + p);
  const result: FeesInfo = { estimated: rewardForRedeem, max: rewardForRedeem };

  return result;
};

export const getRedeemRewardInToken = (nativeTokenPriceInUsd: BigNumber, nativeTokenPriceInCurrency: BigNumber, redeemFee: BigNumber): FeesInfo => {
  const inNativeToken = getRedeemRewardInNativeToken(nativeTokenPriceInUsd, redeemFee);

  return {
    estimated: inNativeToken.estimated.multipliedBy(nativeTokenPriceInCurrency),
    max: inNativeToken.max.multipliedBy(nativeTokenPriceInCurrency)
  };
};
