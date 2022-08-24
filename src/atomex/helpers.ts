import { ExchangeSymbolsProvider, ordersHelper } from '../exchange/index';
import type { NormalizedSwapPreviewParameters, SwapPreviewParameters } from './models/index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNormalizedSwapPreviewParameters = (swapPreviewParameters: any): swapPreviewParameters is NormalizedSwapPreviewParameters => {
  return ordersHelper.isNormalizedOrderPreviewParameters(swapPreviewParameters);
};

export const normalizeSwapPreviewParameters = (
  swapPreviewParameters: SwapPreviewParameters,
  exchangeSymbolsProvider: ExchangeSymbolsProvider,
  defaultUseWatchTowerParameter: boolean
): NormalizedSwapPreviewParameters => {
  const normalizedOrderPreviewParameters = ordersHelper.normalizeOrderPreviewParameters(swapPreviewParameters, exchangeSymbolsProvider);

  return {
    type: swapPreviewParameters.type,
    amount: swapPreviewParameters.amount,
    useWatchTower: typeof swapPreviewParameters.useWatchTower !== 'boolean' ? defaultUseWatchTowerParameter : swapPreviewParameters.useWatchTower,
    from: normalizedOrderPreviewParameters.from,
    to: normalizedOrderPreviewParameters.to,
    isFromAmount: normalizedOrderPreviewParameters.isFromAmount,
    exchangeSymbol: normalizedOrderPreviewParameters.exchangeSymbol,
    side: normalizedOrderPreviewParameters.side,
    isQuoteCurrencyAmount: normalizedOrderPreviewParameters.isQuoteCurrencyAmount,
  };
};
