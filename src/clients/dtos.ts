export type Side = 'Buy' | 'Sell';
export type OrderType = 'Return' | 'FillOrKill' | 'ImmediateOrCancel' | 'SolidFillOrKill';
export type OrderStatus = 'Pending' | 'Placed' | 'PartiallyFilled' | 'Filled' | 'Canceled' | 'Rejected';

export type PartyStatus =
  | 'Created'
  | 'Involved'
  | 'PartiallyInitiated'
  | 'Initiated'
  | 'Redeemed'
  | 'Refunded'
  | 'Lost'
  | 'Jackpot';

export type TransactionStatus = 'Pending' | 'Confirmed' | 'Canceled';
export type TransactionType = 'Lock' | 'AdditionalLock' | 'Redeem' | 'Refund';

export interface QuoteDto {
  symbol: string;
  timeStamp: number;
  bid: number;
  ask: number;
}

export interface SymbolDto {
  name: string;
  minimumQty: number;
}

export interface OrderBookDto {
  updateId: number;
  symbol: string;
  entries: OrderBookEntryDto[];
}

export interface OrderBookEntryDto {
  side: Side;
  price: number;
  qtyProfile: number[];
}

export interface OrderDto {
  id: number;
  clientOrderId: string;
  symbol: string;
  side: Side;
  timeStamp: string;
  price: number;
  qty: number;
  leaveQty: number;
  type: OrderType;
  status: OrderStatus;
  trades: TradeDto[] | null;
  swaps: SwapDto[] | null;
}

export interface TradeDto {
  orderId: number;
  price: number;
  qty: number;
}

export interface SwapDto {
  id: number;
  symbol: string;
  side: Side;
  timeStamp: string;
  price: number;
  qty: number;
  secret: string;
  secretHash: string;
  isInitiator: boolean;
  user: UserSwapDataDto | null;
  counterParty: UserSwapDataDto | null;
}

export interface UserSwapDataDto {
  requisites: SwapRequisitesDto;
  status: PartyStatus;
  trades: TradeDto[];
  transactions: TransactionDto[];
}

export interface SwapRequisitesDto {
  secretHash: string | null;
  receivingAddress: string | null;
  refundAddress: string | null;
  rewardForRedeem: number;
  lockTime: number;
  baseCurrencyContract: string | null;
  quoteCurrencyContract: string | null;
}

export interface TransactionDto {
  currency: string;
  txId: string;
  blockHeight: number;
  confirmations: number;
  status: TransactionStatus;
  type: TransactionType;
}

export interface CreatedOrderDto {
  orderId: number;
}
