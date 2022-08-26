import type { Currency } from '../../common';
import type { PriceManager } from '../../exchange';
import type { AtomexBlockchainProvider } from '../atomexBlockchainProvider';
import type { FeesInfo } from '../models/index';

export const getRedeemRewardInNativeCurrency = async (
  currencyId: Currency['id'],
  redeemFee: FeesInfo,
  priceManager: PriceManager
): Promise<FeesInfo> => {
  const nativeTokenPriceInUsd = await priceManager.getAveragePrice({ baseCurrency: currencyId, quoteCurrency: 'USD' });
  if (!nativeTokenPriceInUsd)
    throw new Error(`Price for ${currencyId} in USD not found`);

  const maxRewardPercentValue = 30;
  const maxRewardPercent = 0.15;
  const maxRewardForRedeemDeviation = 0.05;

  const redeemFeeInUsd = redeemFee.estimated.multipliedBy(nativeTokenPriceInUsd);
  const k = maxRewardPercentValue / Math.log((1 - maxRewardPercent) / maxRewardForRedeemDeviation);
  const p = (1 - maxRewardPercent) / Math.exp(redeemFeeInUsd.toNumber() / k) + maxRewardPercent;

  const rewardForRedeem = redeemFee.estimated.multipliedBy(1 + p);
  const result: FeesInfo = { estimated: rewardForRedeem, max: rewardForRedeem };

  return result;
};

export const getRedeemRewardInToken = async (
  currencyId: string,
  redeemFee: FeesInfo,
  priceManager: PriceManager,
  blockchainProvider: AtomexBlockchainProvider
): Promise<FeesInfo> => {
  const currencyInfo = blockchainProvider.getCurrency(currencyId);
  if (!currencyInfo)
    throw new Error(`Currency info not found for ${currencyId}`);

  const nativeCurrencyId = blockchainProvider.getNativeCurrencyInfo(currencyInfo.blockchain)?.currency.id;
  if (!nativeCurrencyId)
    throw new Error(`Native currency not found fir ${currencyInfo.blockchain}`);

  const nativeTokenPriceInCurrency = await priceManager.getAveragePrice({ baseCurrency: nativeCurrencyId, quoteCurrency: currencyId });

  if (!nativeTokenPriceInCurrency)
    throw new Error(`Price for ${nativeCurrencyId} in ${currencyId} not found`);

  const inNativeToken = await getRedeemRewardInNativeCurrency(nativeCurrencyId, redeemFee, priceManager);

  return {
    estimated: inNativeToken.estimated.multipliedBy(nativeTokenPriceInCurrency),
    max: inNativeToken.max.multipliedBy(nativeTokenPriceInCurrency)
  };
};
