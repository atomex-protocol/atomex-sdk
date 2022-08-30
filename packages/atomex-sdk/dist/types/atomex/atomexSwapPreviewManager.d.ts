import BigNumber from 'bignumber.js';
import type { CurrencyInfo, FeesInfo } from '../blockchain/index';
import type { Currency, Disposable } from '../common/index';
import { Mutable } from '../core/index';
import { ExchangeSymbolsProvider, type NormalizedOrderPreviewParameters, type OrderPreview } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import type { NormalizedSwapPreviewParameters, SwapPreview, SwapPreviewFee, SwapPreviewParameters } from './models/index';
interface UserInvolvedSwapsInfo {
    readonly swaps: readonly Swap[];
    readonly fromCurrencyId: string;
    readonly fromTotalAmount: BigNumber;
}
export declare class AtomexSwapPreviewManager implements Disposable {
    protected readonly atomexContext: AtomexContext;
    private readonly swapPreviewFeesCache;
    private readonly userInvolvedSwapsCache;
    constructor(atomexContext: AtomexContext);
    getSwapPreview(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): Promise<SwapPreview>;
    clearCache(): void;
    dispose(): Promise<void>;
    protected normalizeSwapPreviewParametersIfNeeded(swapPreviewParameters: SwapPreviewParameters | NormalizedSwapPreviewParameters): NormalizedSwapPreviewParameters;
    protected getSwapPreviewAccountData(normalizedSwapPreviewParameters: NormalizedOrderPreviewParameters, fromCurrencyInfo: CurrencyInfo, fromNativeCurrencyInfo: CurrencyInfo, toCurrencyInfo: CurrencyInfo, toNativeCurrencyInfo: CurrencyInfo, fromAvailableAmount: BigNumber, swapPreviewFees: SwapPreview['fees'], errors: Mutable<SwapPreview['errors']>, warnings: Mutable<SwapPreview['warnings']>): Promise<{
        fromAddress?: string;
        toAddress?: string;
        maxOrderPreview?: OrderPreview;
    }>;
    protected getMaxOrderPreview(normalizedSwapPreviewParameters: NormalizedOrderPreviewParameters, fromAddress: string, fromAvailableAmount: BigNumber, fromCurrencyBalance: BigNumber, fromCurrencyInfo: CurrencyInfo, _fromNativeCurrencyBalance: BigNumber, fromNativeCurrencyInfo: CurrencyInfo, fromNativeCurrencyNetworkFee: BigNumber, _errors: Mutable<SwapPreview['errors']>, _warnings: Mutable<SwapPreview['warnings']>): Promise<OrderPreview | undefined>;
    protected getUserInvolvedSwapsInfo(userAddress: string, fromCurrencyId: Currency['id']): Promise<UserInvolvedSwapsInfo>;
    protected calculateSwapPreviewFees(fromCurrencyInfo: CurrencyInfo, fromNativeCurrencyInfo: CurrencyInfo, toCurrencyInfo: CurrencyInfo, toNativeCurrencyInfo: CurrencyInfo, useWatchTower: boolean): Promise<SwapPreview['fees']>;
    protected calculateMakerFees(fromCurrency: Currency, fromNativeCurrency: Currency, toNativeCurrency: Currency, toInitiateFees: FeesInfo, fromRedeemFees: FeesInfo): Promise<SwapPreviewFee>;
    protected convertFeesFromNativeCurrencyToCustom(fees: FeesInfo, nativeCurrency: Currency, customCurrency: Currency): Promise<FeesInfo>;
    private getSwapPreviewFeesCacheKey;
    private getUserInvolvedSwapsCacheKey;
    static isNormalizedSwapPreviewParameters(swapPreviewParameters: any): swapPreviewParameters is NormalizedSwapPreviewParameters;
    static normalizeSwapPreviewParameters(swapPreviewParameters: SwapPreviewParameters, exchangeSymbolsProvider: ExchangeSymbolsProvider, defaultUseWatchTowerParameter: boolean): NormalizedSwapPreviewParameters;
    protected static calculateMaxTotalFee(fees: SwapPreview['fees'], currencyId: Currency['id']): BigNumber;
    protected static calculateTotalFee(fees: readonly SwapPreviewFee[], currencyId: Currency['id']): BigNumber;
}
export {};
