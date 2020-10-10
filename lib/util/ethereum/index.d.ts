import { ExpectedSwapData, SwapDetails } from "../../type/util";
/**
 * Ethereum Util class for Ethereum related Atomex helper functions
 */
export declare class EthereumUtil {
    private _rpc;
    private _chainClient;
    private _contract;
    private _init;
    constructor();
    /**
     * Connects to the supported ethereum chain
     *
     * @param rpc rpc endpoint to create eth chain client
     * @returns chain id of the connected chain
     */
    connect(rpc: string): Promise<number>;
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
    initiate(swapDetails: SwapDetails): Promise<{
        data: string;
        contractAddr: string;
    }>;
    /**
     * Get the tx data for Atomex Contract Redeem Swap call
     *
     * @param secret secret that can used to verify and redeem the funds
     * @returns contract address and tx data that can be used to make a contract call
     */
    redeem(secret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    /**
     * Get the tx data for Atomex Contract Refund Swap call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    refund(hashedSecret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    /**
     * Get the tx data for Atomex Contract AdditionalFunds call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    add(hashedSecret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    /**
     * Get the tx data for Atomex Contract Activate Swap call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    activate(hashedSecret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    /**
     * Parse tx data for an Atomex Contract call
     *
     * @param txHash transaction hash to identify blockchain transaction
     * @returns the parameters and function name of the contract call
     */
    private getTxData;
    /**
     * Validate the Swap Details on chain using the tx detail from Atomex
     *
     * @param txHash transaction hash to identify blockchain transaction
     * @param expectedData expected swap details that will be used for validation
     * @param confirmations no. of tx confirmations required
     * @returns true/false depending on transaction validity
     */
    validateSwapTransaction(txHash: string, expectedData: ExpectedSwapData, confirmations?: number): Promise<boolean>;
}
/**
 * Singleton instance of EthereumUtil
 */
export declare const Ethereum: EthereumUtil;
