export enum SwapOperationCompleteStage {
  None = 0,

  OrdersMatching = 1 << 0,
  SendInitiateTransaction = 1 << 1,
  SendRedeemTransaction = 1 << 2,
  SendRefundTransaction = 1 << 3,

  All = OrdersMatching | SendInitiateTransaction | SendRedeemTransaction | SendRefundTransaction
}
