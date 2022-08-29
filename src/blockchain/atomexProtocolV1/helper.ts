import type { Currency } from '../../common';
import type { PriceManager } from '../../exchange';
import type { AtomexBlockchainProvider } from '../atomexBlockchainProvider';
import type { FeesInfo } from '../models/index';

export const getRedeemRewardInNativeCurrency = async (
  currencyOrId: Currency | Currency['id'],
  redeemFee: FeesInfo,
  priceManager: PriceManager
): Promise<FeesInfo> => {
  const nativeTokenPriceInUsd = await priceManager.getAveragePrice({ baseCurrencyOrIdOrSymbol: currencyOrId, quoteCurrencyOrIdOrSymbol: 'USD' });
  if (!nativeTokenPriceInUsd)
    throw new Error(`Price for ${currencyOrId} in USD not found`);

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
  currencyOrId: Currency | Currency['id'],
  redeemFee: FeesInfo,
  priceManager: PriceManager,
  blockchainProvider: AtomexBlockchainProvider
): Promise<FeesInfo> => {
  const currency = typeof currencyOrId === 'string' ? blockchainProvider.getCurrency(currencyOrId) : currencyOrId;
  if (!currency)
    throw new Error(`Currency info not found for ${currencyOrId}`);

  const nativeCurrency = blockchainProvider.getNativeCurrencyInfo(currency.blockchain)?.currency;
  if (!nativeCurrency)
    throw new Error(`Native currency not found fir ${currency.blockchain}`);

  const nativeTokenPriceInCurrency = await priceManager.getAveragePrice({ baseCurrencyOrIdOrSymbol: nativeCurrency, quoteCurrencyOrIdOrSymbol: currencyOrId });

  if (!nativeTokenPriceInCurrency)
    throw new Error(`Price for ${nativeCurrency.id} in ${currencyOrId} not found`);

  const inNativeToken = await getRedeemRewardInNativeCurrency(nativeCurrency.id, redeemFee, priceManager);

  return {
    estimated: inNativeToken.estimated.multipliedBy(nativeTokenPriceInCurrency),
    max: inNativeToken.max.multipliedBy(nativeTokenPriceInCurrency)
  };
};
