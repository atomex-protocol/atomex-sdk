import { ExpectedSwapData, SwapDetails } from "../../type/util";
/**
 * Tezos Util class for Tezos related Atomex helper functions
 */
export declare class TezosUtil {
    private _rpc;
    private _chainClient;
    private _contract;
    private _init;
    private _contractAddr;
    constructor();
    /**
     * Connects to the supported tezos chain
     *
     * @param rpc rpc endpoint to create tezos chain client
     * @returns chain id of the connected chain
     */
    connect(rpc: string): Promise<string>;
    /**
     * Checks if chain client has been initialized or not
     */
    private status;
    /**
     * Get the tx data for Atomex Contract Initiate Swap call
     *
     * @param swapDetails details of the swap being initiated
     * @returns contract address and tx data that can be used to make a contract call
     */
    initiate(swapDetails: SwapDetails): {
        parameter: string;
        contractAddr: string;
    };
    /**
     * Get the tx data for Atomex Contract Redeem Swap call
     *
     * @param secret secret that can used to verify and redeem the funds
     * @returns contract address and tx data that can be used to make a contract call
     */
    redeem(secret: string): {
        parameter: string;
        contractAddr: string;
    };
    /**
     * Get the tx data for Atomex Contract Refund Swap call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    refund(hashedSecret: string): {
        parameter: string;
        contractAddr: string;
    };
    /**
     * Get the tx data for Atomex Contract AdditionalFunds call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    add(hashedSecret: string): {
        parameter: string;
        contractAddr: string;
    };
    /**
     * Get Block endorsements and level
     *
     * @param blockLevel block level to identify the block
     * @returns endorsements and level of the block
     */
    getBlockDetails(blockLevel: "head" | number): Promise<{
        endorsements: number;
        level: number;
    }>;
    /**
     * Get the Swap Initiate parameters from a tx
     *
     * @param blockHeight block height of the block where the tx is present
     * @param txID operation/tx hash of the contract call
     * @param hashedSecret hashedSecret to identify swap
     */
    private getSwapParams;
    /**
     * Validate the Swap Details on chain using the tx detail from Atomex
     *
     * @param blockHeight block height of the block where the tx is present
     * @param txID operation/tx hash to identify blockchain transaction
     * @param expectedData expected swap details that will be used for validation
     * @param confirmations no. of tx confirmations required
     * @returns true/false depending on transaction validity
     */
    validateSwapTransaction(blockHeight: number, txID: string, expectedData: ExpectedSwapData, confirmations?: number): Promise<boolean>;
}
/**
 * Singleton instance of TezosUtil
 */
export declare const Tezos: TezosUtil;
