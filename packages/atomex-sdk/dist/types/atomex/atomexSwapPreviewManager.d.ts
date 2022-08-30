import BigNumber from 'bignumber.js';
import type { CurrencyInfo, FeesInfo } from '../blockchain/index';
import type { Currency } from '../common/index';
import { Mutable } from '../core/index';
import { ExchangeSymbolsProvider, type NormalizedOrderPreviewParameters, type OrderPreview } from '../exchange/index';
import type { AtomexContext } from './atomexContext';
import type { NormalizedSwapPreviewParameters, SwapPreview, SwapPreviewFee, SwapPreviewParameters } from './models/index';
export declare class AtomexSwapPreviewManager {
    protected readonly atomexContext: AtomexContext;
    private readonly swapPreviewFeesCache;
    constructor(atomexContext: AtomexContext);
    getSwapPreview(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): Promise<SwapPreview>;
    protected normalizeSwapPreviewParametersIfNeeded(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): NormalizedSwapPreviewParameters;
    protected getSwapPreviewAccountData(normalizedSwapPreviewParameters: NormalizedOrderPreviewParameters, fromCurrencyInfo: CurrencyInfo, fromNativeCurrencyInfo: CurrencyInfo, toCurrencyInfo: CurrencyInfo, toNativeCurrencyInfo: CurrencyInfo, fromAvailableAmount: BigNumber, swapPreviewFees: SwapPreview['fees'], errors: Mutable<SwapPreview['errors']>, warnings: Mutable<SwapPreview['warnings']>): Promise<{
        fromAddress?: string;
        toAddress?: string;
        maxOrderPreview?: OrderPreview;
    }>;
    protected getMaxOrderPreview(normalizedSwapPreviewParameters: NormalizedOrderPreviewParameters, fromAvailableAmount: BigNumber, fromCurrencyBalance: BigNumber, fromCurrencyInfo: CurrencyInfo, _fromNativeCurrencyBalance: BigNumber, fromNativeCurrencyInfo: CurrencyInfo, fromNativeCurrencyNetworkFee: BigNumber, errors: Mutable<SwapPreview['errors']>, _warnings: Mutable<SwapPreview['warnings']>): Promise<OrderPreview | undefined>;
    protected calculateSwapPreviewFees(fromCurrencyInfo: CurrencyInfo, fromNativeCurrencyInfo: CurrencyInfo, toCurrencyInfo: CurrencyInfo, toNativeCurrencyInfo: CurrencyInfo, useWatchTower: boolean): Promise<SwapPreview['fees']>;
    protected calculateMakerFees(fromCurrency: Currency, fromNativeCurrency: Currency, toNativeCurrency: Currency, toInitiateFees: FeesInfo, fromRedeemFees: FeesInfo): Promise<SwapPreviewFee>;
    protected convertFeesFromNativeCurrencyToCustom(fees: FeesInfo, nativeCurrency: Currency, customCurrency: Currency): Promise<FeesInfo>;
    private getSwapPreviewFeesCacheKey;
    static isNormalizedSwapPreviewParameters(swapPreviewParameters: any): swapPreviewParameters is NormalizedSwapPreviewParameters;
    static normalizeSwapPreviewParameters(swapPreviewParameters: SwapPreviewParameters, exchangeSymbolsProvider: ExchangeSymbolsProvider, defaultUseWatchTowerParameter: boolean): NormalizedSwapPreviewParameters;
    protected static calculateMaxTotalFee(fees: SwapPreview['fees'], currencyId: Currency['id']): BigNumber;
    protected static calculateTotalFee(fees: readonly SwapPreviewFee[], currencyId: Currency['id']): BigNumber;
}
