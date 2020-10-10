import { ExpectedSwapData, SwapDetails } from "../../type/util";
export declare class TezosUtil {
    private _rpc;
    private _chainClient;
    private _contract;
    private _init;
    private _contractAddr;
    constructor();
    connect(rpc: string): Promise<string>;
    private status;
    initiate({ hashedSecret, participant, refundTimestamp, payoff, }: SwapDetails): {
        parameter: string;
        contractAddr: string;
    };
    redeem(secret: string): {
        parameter: string;
        contractAddr: string;
    };
    refund(hashedSecret: string): {
        parameter: string;
        contractAddr: string;
    };
    add(hashedSecret: string): {
        parameter: string;
        contractAddr: string;
    };
    getCurrentHeadDetails(blockLevel: "head" | number): Promise<{
        endorsements: number;
        level: number;
    }>;
    private getSwapParams;
    validateSwapTransaction(blockHeight: number, txID: string, expectedData: ExpectedSwapData, confirmations?: number): Promise<boolean>;
}
export declare const Tezos: TezosUtil;
