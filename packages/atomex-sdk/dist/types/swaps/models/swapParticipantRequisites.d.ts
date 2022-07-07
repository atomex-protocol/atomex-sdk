import type { BigNumber } from 'bignumber.js';
export interface SwapParticipantRequisites {
    readonly secretHash: string | null;
    readonly receivingAddress: string;
    readonly refundAddress?: string;
    readonly rewardForRedeem: BigNumber;
    readonly lockTime: number;
}
