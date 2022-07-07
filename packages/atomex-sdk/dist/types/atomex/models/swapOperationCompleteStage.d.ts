export declare enum SwapOperationCompleteStage {
    None = 0,
    OrdersMatching = 1,
    SendInitiateTransaction = 2,
    SendRedeemTransaction = 4,
    SendRefundTransaction = 8,
    All = 15
}
