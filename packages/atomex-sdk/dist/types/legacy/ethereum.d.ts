import Web3 from 'web3';
import type { Transaction } from 'web3-core';
import type { AbiInput, AbiItem } from 'web3-utils';
import { Helpers } from './helpers';
import type { AuthMessage, InitiateParameters, PartialTransactionBody, RedeemFees, SwapTransactionStatus } from './types';
export interface Function {
    types: AbiInput[];
    signature: string;
}
/**
 * Ethereum Util class for Ethereum related Atomex helper functions
 */
export declare class EthereumHelpers extends Helpers {
    private _web3;
    private _contract;
    private _timeBetweenBlocks;
    private _functions;
    private _gasLimit;
    constructor(web3: Web3, jsonInterface: AbiItem[], contractAddress: string, timeBetweenBlocks: number, gasLimit: number);
    /**
     * Connects to the supported ethereum chain
     *
     * @param chain chains supported by atomex, can be either mainnet or testnet
     * @param rpc optional rpc endpoint to create eth chain client
     * @returns chain id of the connected chain
     */
    static create(network: 'mainnet' | 'testnet', rpcUri?: string): Promise<EthereumHelpers>;
    getAuthMessage(message: string, _address?: string): AuthMessage;
    buildInitiateTransaction(initiateParameters: InitiateParameters): PartialTransactionBody;
    buildRedeemTransaction(secret: string, hashedSecret: string): PartialTransactionBody;
    buildRefundTransaction(secretHash: string): PartialTransactionBody;
    buildAddTransaction(secretHash: string, amount: number): PartialTransactionBody;
    /**
     * Get the tx data for Atomex Contract Activate Swap call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    buildActivateTransaction(secretHash: string): PartialTransactionBody;
    parseInitiateParameters(transaction: Transaction): InitiateParameters;
    validateInitiateTransaction(_blockHeight: number, txID: string, secretHash: string, receivingAddress: string, amount: number, payoff: number, minRefundTimestamp: number, minConfirmations?: number): Promise<SwapTransactionStatus>;
    private hexSlice;
    private getVRS;
    /**
     * Recover Ethereum Account Public Key from RLC signature
     *
     * @param msg original message, `msgToSign` parameter generated using [[getAuthMessage]]
     * @param signature signed message
     * @returns ethereum public key
     */
    recoverPublicKey(msg: string, signature: string): string;
    encodePublicKey(pubKey: string): string;
    encodeSignature(signature: string): string;
    estimateInitiateFees(source: string): Promise<number>;
    estimateRedeemFees(_recipient: string): Promise<RedeemFees>;
    isValidAddress(address: string): boolean;
}
