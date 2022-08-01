import type {
  AuthMessage,
  InitiateParameters,
  PartialTransactionBody,
  RedeemFees,
  SwapTransactionStatus,
} from './types';

export abstract class Helpers {
  /**
   * Get the details needed for `getAuthToken` request
   *
   * @remarks the `msgToSign` value needs to be signed before being used for Auth
   * @param message message to include for the Atomex Authentication message
   * @param address required for Tezos blockchain, in order to determine the EC algorithm
   * @returns details required for Atomex Auth
   */
  abstract getAuthMessage(
    message: string,
    address?: string,
  ): AuthMessage;

  /**
   * Get the tx data for Atomex Contract Initiate Swap call
   *
   * @param swapDetails details of the swap being initiated
   * @returns contract address and tx data that can be used to make a contract call
   */
  abstract buildInitiateTransaction(
    initiateParameters: InitiateParameters,
  ): PartialTransactionBody;

  /**
   * Get the tx data for Atomex Contract Redeem Swap call
   *
   * @param secret secret that can used to verify and redeem the funds
   * @returns contract address and tx data that can be used to make a contract call
   */
  abstract buildRedeemTransaction(
    secret: string,
    hashedSecret: string,
  ): PartialTransactionBody;

  /**
   * Get the tx data for Atomex Contract Refund Swap call
   *
   * @param secretHash secretHash to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  abstract buildRefundTransaction(
    secretHash: string,
  ): PartialTransactionBody;

  /**
   * Get the tx data for Atomex Contract AdditionalFunds call
   *
   * @param secretHash secretHash to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  abstract buildAddTransaction(
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
  abstract validateInitiateTransaction(
    blockHeight: number,
    txID: string,
    secretHash: string,
    receivingAddress: string,
    amount: number,
    payoff: number,
    minRefundTimestamp: number,
    minConfirmations: number,
  ): Promise<SwapTransactionStatus>;

  /**
   * Encodes Signature in a form compliant with Atomex
   *
   * @param signature signature to encode
   * @returns encoded signature
   */
  abstract encodeSignature(signature: string): string;

  /**
   * Encodes Public Key in a form compliant with Atomex
   *
   * @param publicKey public key
   * @returns encoded public key
   */
  abstract encodePublicKey(publicKey: string): string;

  /**
   * Estimates Initiate fees for a Swap
   *
   * @param source the initiator address
   * @returns the initiate fees for Swap
   */
  abstract estimateInitiateFees(source: string): Promise<number>;

  /**
   * Estimates Miner Fee and Reward for Redeem to be used in a Swap
   *
   * @param recipient the counter-party address
   * @returns the minerFee and the rewardForRedeem
   */
  abstract estimateRedeemFees(recipient: string): Promise<RedeemFees>;

  /**
   * Check validity of an account address
   * 
   * @param address account address
   * @returns true if valid, else false
   */
  abstract isValidAddress(address: string): boolean;
}

export const dt2ts = (isoTime: Date | string): number =>
  Math.round(new Date(isoTime).getTime() / 1000);

export const now = (): number => Math.round(Date.now() / 1000);
