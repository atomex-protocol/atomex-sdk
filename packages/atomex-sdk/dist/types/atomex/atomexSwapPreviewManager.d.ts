import BigNumber from 'bignumber.js';
import type { CurrencyInfo, FeesInfo } from '../blockchain/index';
import type { Currency, Disposable } from '../common/index';
import { Mutable } from '../core/index';
import { ExchangeSymbolsProvider, SymbolLiquidity, type OrderPreview } from '../exchange/index';
import type { Swap } from '../swaps/index';
import type { AtomexContext } from './atomexContext';
import type { NormalizedSwapPreviewParameters, SwapPreview, SwapPreviewFee, SwapPreviewParameters } from './models/index';
interface SwapCurrencyInfos {
    readonly fromCurrencyInfo: CurrencyInfo;
    readonly fromNativeCurrencyInfo: CurrencyInfo;
    readonly toCurrencyInfo: CurrencyInfo;
    readonly toNativeCurrencyInfo: CurrencyInfo;
    readonly isFromCurrencyNative: boolean;
    readonly isToCurrencyNative: boolean;
}
interface UserInvolvedSwapsInfoCurrencySection {
    readonly swaps: readonly Swap[];
    readonly swapIds: ReadonlyArray<Swap['id']>;
    readonly currencyId: string;
    readonly lockedAmount: BigNumber;
}
interface UserInvolvedSwapsInfo {
    readonly [currency: Currency['id']]: UserInvolvedSwapsInfoCurrencySection;
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
    protected getSwapCurrencyInfos(fromCurrencyId: Currency['id'], toCurrencyId: Currency['id']): SwapCurrencyInfos;
    protected getSwapPreviewInternal(swapPreviewParameters: NormalizedSwapPreviewParameters, swapCurrencyInfos: SwapCurrencyInfos): Promise<SwapPreview>;
    protected getSwapPreviewAccountData(_swapPreviewParameters: NormalizedSwapPreviewParameters, actualOrderPreview: OrderPreview | undefined, availableLiquidity: SymbolLiquidity, swapCurrencyInfos: SwapCurrencyInfos, swapPreviewFees: SwapPreview['fees'], errors: Mutable<SwapPreview['errors']>, _warnings: Mutable<SwapPreview['warnings']>): Promise<{
        fromAddress?: string;
        toAddress?: string;
        maxOrderPreview?: OrderPreview;
    }>;
    protected getMaxOrderPreview(fromCurrencyBalance: BigNumber, availableLiquidity: SymbolLiquidity): Promise<OrderPreview | undefined>;
    protected getUserInvolvedSwapsInfo(fromAddress: string | undefined, toAddress: string | undefined, swapCurrencyInfos: SwapCurrencyInfos): Promise<UserInvolvedSwapsInfo | undefined>;
    protected getUserInvolvedSwapsInfoByActiveSwaps(involvedSwaps: readonly Swap[]): Promise<UserInvolvedSwapsInfo>;
    private getOrCreateUserInvolvedSwapsCurrencyInfo;
    protected getInvolvedSwaps(addresses: string[]): Promise<Swap[]>;
    protected calculateSwapPreviewFees(swapCurrencyInfos: SwapCurrencyInfos, watchTowerOptions: NormalizedSwapPreviewParameters['watchTower']): Promise<SwapPreview['fees']>;
    protected calculateMakerFees(fromCurrency: Currency, fromNativeCurrency: Currency, toNativeCurrency: Currency, toInitiateFees: FeesInfo, fromRedeemFees: FeesInfo): Promise<SwapPreviewFee>;
    protected convertFeesFromNativeCurrencyToCustom(fees: FeesInfo, nativeCurrency: Currency, customCurrency: Currency): Promise<FeesInfo>;
    private getSwapPreviewFeesCacheKey;
    private getUserInvolvedSwapsCacheKey;
    static isNormalizedSwapPreviewParameters(swapPreviewParameters: any): swapPreviewParameters is NormalizedSwapPreviewParameters;
    static normalizeSwapPreviewParameters(swapPreviewParameters: SwapPreviewParameters, exchangeSymbolsProvider: ExchangeSymbolsProvider, defaultWatchTowerOptions: NormalizedSwapPreviewParameters['watchTower']): NormalizedSwapPreviewParameters;
    protected static calculateMaxTotalFee(fees: SwapPreview['fees'], currencyId: Currency['id']): BigNumber;
    protected static calculateTotalFee(fees: readonly SwapPreviewFee[], currencyId: Currency['id']): BigNumber;
}
export {};
