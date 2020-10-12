import { ExpectedSwapData, SwapDetails, SwapValidity } from "../../type/util";
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
     * @param chain chains supported by atomex, can be either mainnet or testnet
     * @param rpc optional rpc endpoint to create tezos chain client
     * @returns chain id of the connected chain
     */
    connect(chain: "mainnet" | "testnet", rpc?: string): Promise<string>;
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
     * @returns endorsements , level of the block and block generation time
     */
    private getBlockDetails;
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
     * [does not check tx status, use status provided by atomex]
     *
     * @param blockHeight block height of the block where the tx is present
     * @param txID operation/tx hash to identify blockchain transaction
     * @param expectedData expected swap details that will be used for validation
     * @param confirmations no. of tx confirmations required
     * @returns status of tx, current no. of confirms and est. next block generation timestamp.
     * No. of confirmations and block timestamp is only returned when `status:Included`
     */
    validateSwapDetails(blockHeight: number, txID: string, expectedData: ExpectedSwapData, confirmations?: number): Promise<SwapValidity>;
}
/**
 * Singleton instance of TezosUtil
 */
export declare const Tezos: TezosUtil;
