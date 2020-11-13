import {
  AuthMessage,
  InitiateParameters,
  PartialTransactionBody,
  SwapTransactionStatus,
} from "./types";

export abstract class Helpers {
  /**
   * Get the details needed for `getAuthToken` request
   *
   * @remarks the `msgToSign` value needs to be signed before being used for Auth
   * @param message message to include for the Atomex Authentication message
   * @returns details required for Atomex Auth
   */
  public abstract getAuthMessage(
    message: string,
    address?: string,
  ): AuthMessage;

  /**
   * Get the tx data for Atomex Contract Initiate Swap call
   *
   * @param swapDetails details of the swap being initiated
   * @returns contract address and tx data that can be used to make a contract call
   */
  public abstract buildInitiateTransaction(
    initiateParameters: InitiateParameters,
  ): PartialTransactionBody;

  /**
   * Get the tx data for Atomex Contract Redeem Swap call
   *
   * @param secret secret that can used to verify and redeem the funds
   * @returns contract address and tx data that can be used to make a contract call
   */
  public abstract buildRedeemTransaction(
    secret: string,
  ): PartialTransactionBody;

  /**
   * Get the tx data for Atomex Contract Refund Swap call
   *
   * @param secretHash secretHash to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  public abstract buildRefundTransaction(
    secretHash: string,
  ): PartialTransactionBody;

  /**
   * Get the tx data for Atomex Contract AdditionalFunds call
   *
   * @param secretHash secretHash to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  public abstract buildAddTransaction(
    secretHash: string,
    amount: number,
  ): PartialTransactionBody;

  /**
   * Validate the Swap Details on chain using the tx detail from Atomex
   * [does not check tx status, use status provided by atomex]
   *
   * @param blockHeight block height of the block where the tx is present
   * @param txID operation/tx hash to identify blockchain transaction
   * @param expectedData expected swap details that will be used for validation
   * @param confirmations no. of tx confirmations required
   * @returns status of tx, current no. of confirms and est. next block generation timestamp.
   * No. of confirmations and block timestamp is only returned when `status:Included`
   */
  public abstract async validateInitiateTransaction(
    blockHeight: number,
    txID: string,
    secretHash: string,
    receivingAddress: string,
    netAmount: number,
    minRefundTimestamp: number,
    minConfirmations: number,
  ): Promise<SwapTransactionStatus>;

  /**
   * Encodes Signature in a form compliant with Atomex
   *
   * @param signature signature to encode
   * @returns encoded signature
   */
  public abstract encodeSignature(signature: string): string;

  /**
   * Encodes Public Key in a form compliant with Atomex
   *
   * @param publicKey public key
   * @returns encoded public key
   */
  public abstract encodePublicKey(publicKey: string): string;
}

export const dt2ts = (isoTime: Date | string): number =>
  Math.round(new Date(isoTime).getTime() / 1000);

export const now = (): number => Math.round(Date.now() / 1000);
