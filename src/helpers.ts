import { AuthMessage, InitiateParameters, PartialTransactionBody, SwapTransactionStatus } from "../types";

export abstract class Helpers {
  public abstract getAuthMessage(message: string, address?: string) : AuthMessage;
  public abstract buildInitiateTransaction(initiateParameters: InitiateParameters) : PartialTransactionBody;
  public abstract buildRedeemTransaction(secret: string) : PartialTransactionBody;
  public abstract buildRefundTransaction(secretHash: string) : PartialTransactionBody;
  public abstract buildAddTransaction(secretHash: string, amount: number) : PartialTransactionBody;
  public abstract async validateInitiateTransaction(
    blockHeight: number,
    txID: string,
    secretHash: string,
    receivingAddress: string,
    netAmount: number,
    minRefundTimestamp: number,
    minConfirmations: number,
  ): Promise<SwapTransactionStatus>;
}

export const dt2ts = (isoTime: Date | string) : number => Math.round(new Date(isoTime).getTime() / 1000);
export const now = () : number => Math.round(Date.now() / 1000);
