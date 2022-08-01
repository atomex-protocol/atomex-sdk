import type { BigNumber } from 'bignumber.js';
import type { Side, Currency } from '../../common/index';
import type { SwapParticipant } from './swapParticipant';
export interface Swap {
    readonly id: number;
    readonly isInitiator: boolean;
    readonly trade: SwapTrade;
    readonly from: SwapCurrency;
    readonly to: SwapCurrency;
    readonly secret: string | null;
    readonly secretHash: string;
    readonly user: SwapParticipant;
    readonly counterParty: SwapParticipant;
    readonly timeStamp: Date;
}
interface SwapCurrency {
    readonly currencyId: Currency['id'];
    readonly amount: BigNumber;
    readonly price: BigNumber;
}
interface SwapTrade {
    readonly symbol: string;
    readonly side: Side;
    readonly price: BigNumber;
    readonly qty: BigNumber;
}
export {};
