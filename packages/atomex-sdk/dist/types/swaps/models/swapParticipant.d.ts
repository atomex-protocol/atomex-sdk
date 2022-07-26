import type { BigNumber } from 'bignumber.js';
import type { Transaction } from '../../blockchain/index';
import type { SwapParticipantRequisites } from './swapParticipantRequisites';
import type { SwapParticipantStatus } from './swapParticipantStatus';
export interface SwapParticipant {
    readonly status: SwapParticipantStatus;
    readonly requisites: SwapParticipantRequisites;
    readonly trades: readonly ParticipantTrade[];
    readonly transactions: readonly Transaction[];
}
interface ParticipantTrade {
    readonly orderId: number;
    readonly price: BigNumber;
    readonly qty: BigNumber;
}
export {};
