import { ParameterSchema } from '@taquito/michelson-encoder';
import { BlockResponse, OperationContentsAndResultTransaction } from '@taquito/rpc';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import type { Atomex } from '../atomex';
import { Helpers } from './helpers';
import type { AuthMessage, InitiateParameters, PartialTransactionBody, RedeemFees, SwapTransactionStatus, TezosBasedCurrency, Network } from './types';
/**
 * Tezos Util class for Tezos related Atomex helper functions
 */
export declare class TezosHelpers extends Helpers {
    protected _tezos: TezosToolkit;
    protected _contractAddress: string;
    protected _timeBetweenBlocks: number;
    protected _entrypoints: Map<string, ParameterSchema>;
    protected _gasLimit: number;
    protected _minimalFees: number;
    protected _minimalNanotezPerGasUnit: number;
    protected _minimalNanotezPerByte: number;
    protected _costPerByte: number;
    protected _redeemTxSize: number;
    protected _initiateTxSize: number;
    constructor(atomex: Atomex, tezos: TezosToolkit, entrypoints: Record<string, any>, contractAddress: string, timeBetweenBlocks: number, gasLimit: number, minimalFees: number, minimalNanotezPerGasUnit: number, minimalNanotezPerByte: number, costPerByte: number, redeemTxSize: number, initiateTxSize: number);
    /**
     * Connects to the supported tezos chain
     *
     * @param newAtomex instance of new Atomex class
     * @param network networks supported by atomex, can be either mainnet or testnet
     * @param currency either native currency (XTZ) or any supported FA1.2/FA2 token symbol
     * @param rpcUri optional rpc endpoint to create tezos chain client
     * @returns chain id of the connected chain
     */
    static create(newAtomex: Atomex, network: Network, currency?: TezosBasedCurrency, rpcUri?: string): Promise<TezosHelpers>;
    private getTezosAlgorithm;
    getAuthMessage(message: string, address: string): AuthMessage;
    buildInitiateTransaction(initiateParameters: InitiateParameters): PartialTransactionBody;
    buildRedeemTransaction(secret: string, _hashedSecret?: string): PartialTransactionBody;
    buildRefundTransaction(secretHash: string): PartialTransactionBody;
    /**
     * Get Block level
     *
     * @param blockLevel block level to identify the block
     * @returns level of the block and block generation time
     */
    getBlockDetails(block: BlockResponse): {
        level: number;
        timestamp: number;
    };
    parseInitiateParameters(content: OperationContentsAndResultTransaction): InitiateParameters;
    findContractCall(block: BlockResponse, txID: string): OperationContentsAndResultTransaction[];
    validateInitiateTransaction(blockHeight: number, txID: string, secretHash: string, receivingAddress: string, amount: BigNumber | number, payoff: BigNumber | number, minRefundTimestamp: number, minConfirmations?: number): Promise<SwapTransactionStatus>;
    encodePublicKey(pubKey: string): string;
    encodeSignature(signature: string): string;
    calcFees(gas?: number, storageDiff?: number, txSize?: number): number;
    estimateInitiateFees(source: string): Promise<number>;
    estimateRedeemFees(recipient: string): Promise<RedeemFees>;
    isValidAddress(address: string): boolean;
    private getBlock;
}
