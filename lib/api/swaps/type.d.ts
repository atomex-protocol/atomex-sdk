export declare type TxType = "Lock" | "AdditionalLock" | "Redeem" | "Refund";
export interface GetSwapsRequest {
    symbols?: string;
    sort?: "Desc" | "Asc";
    offset?: number;
    limtit?: number;
    active?: boolean;
    completed?: boolean;
}
export interface AddSwapRequisites {
    secretHash: string;
    receivingAddress: string;
    refundAddress: string;
    rewardForRedeem?: number;
    lockTime: number;
}
