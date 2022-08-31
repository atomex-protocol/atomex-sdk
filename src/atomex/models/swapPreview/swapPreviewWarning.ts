interface SwapPreviewWarningBase<TWarningId extends string = string, TWarningData = unknown> {
  readonly id: TWarningId;
  readonly data?: TWarningData;
}

type CheckWarningType<TWarningId extends string, TWarning extends SwapPreviewWarningBase<TWarningId>> = TWarning;

export type SwapPreviewWarning = CheckWarningType<
  string,
  never
>;
