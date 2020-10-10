import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { ExpectedSwapData, SwapDetails } from "../../type/util";
export declare class EthereumUtil {
    private _rpc;
    _chainClient: Web3;
    _contract: Contract;
    private _init;
    constructor();
    connect(rpc: string): Promise<number>;
    private status;
    initiate({ hashedSecret, participant, refundTimestamp, payoff, active, countdown, }: SwapDetails): Promise<{
        data: string;
        contractAddr: string;
    }>;
    redeem(secret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    refund(hashedSecret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    add(hashedSecret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    activate(hashedSecret: string): Promise<{
        data: string;
        contractAddr: string;
    }>;
    private getTxData;
    validateSwapTransaction(txHash: string, expectedData: ExpectedSwapData, confirmations?: number): Promise<boolean>;
}
export declare const Ethereum: EthereumUtil;
