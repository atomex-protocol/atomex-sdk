import type { Transaction } from '../../blockchain/index';
import type { SwapParticipantRequisites } from './swapParticipantRequisites';
import type { SwapParticipantStatus } from './swapParticipantStatus';
import type { SwapParticipantTrade } from './swapParticipantTrade';
export interface SwapParticipant {
    readonly status: SwapParticipantStatus;
    readonly requisites: SwapParticipantRequisites;
    readonly trades: readonly SwapParticipantTrade[];
    readonly transactions: readonly Transaction[];
}
