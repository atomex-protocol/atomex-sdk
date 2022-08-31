interface SwapPreviewWarningBase<TWarningId extends string = string, TWarningData = unknown> {
    readonly id: TWarningId;
    readonly data?: TWarningData;
}
declare type CheckWarningType<TWarningId extends string, TWarning extends SwapPreviewWarningBase<TWarningId>> = TWarning;
export declare type SwapPreviewWarning = CheckWarningType<string, never>;
export {};
