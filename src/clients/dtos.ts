import type { ProofOfFundsAlgorithm } from '../exchange/index';

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

export interface WebSocketOrderBookEntryDto extends OrderBookEntryDto {
  symbol: string;
  updateId: number;
}

export interface NewOrderRequestDto {
  clientOrderId: string;
  symbol: string;
  price: number;
  qty: number;
  side: Side;
  type: OrderType;
  proofsOfFunds?: ProofOfFundsDto[];
  requisites?: SwapRequisitesDto;
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
  secret: string | null;
  secretHash: string;
  isInitiator: boolean;
  user: UserSwapDataDto;
  counterParty: UserSwapDataDto;
}

export interface UserSwapDataDto {
  requisites: SwapRequisitesDto;
  status: PartyStatus;
  trades: TradeDto[];
  transactions: TransactionDto[];
}

export interface SwapRequisitesDto {
  secretHash: string | null;
  receivingAddress: string;
  refundAddress: string | null;
  rewardForRedeem: number;
  lockTime: number;
  baseCurrencyContract: string;
  quoteCurrencyContract: string;
}

export interface ProofOfFundsDto {
  address: string;
  currency: string;
  timeStamp: number;
  message: string;
  publicKey: string;
  signature: string;
  algorithm: ProofOfFundsAlgorithm;
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

export interface WebSocketOrderDataDto {
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
  trades: TradeDto[];
  swaps: number[];
}

export interface WebSocketRequestDto {
  method: string;
  data: unknown;
  requestId: number;
}

export interface WebSocketResponseBaseDto {
  event: string;
  data: unknown;
  requestId?: number;
}

export interface WebSocketOrderResponseDto extends WebSocketResponseBaseDto {
  event: 'order';
  data: WebSocketOrderDataDto;
}

export interface WebSocketSwapResponseDto extends WebSocketResponseBaseDto {
  event: 'swap';
  data: SwapDto;
}

export interface WebSocketTopOfBookResponseDto extends WebSocketResponseBaseDto {
  event: 'topOfBook';
  data: QuoteDto[];
}

export interface WebSocketOrderBookSnapshotResponseDto extends WebSocketResponseBaseDto {
  event: 'snapshot';
  data: OrderBookDto;
}

export interface WebSocketOrderBookEntriesResponseDto extends WebSocketResponseBaseDto {
  event: 'entries';
  data: WebSocketOrderBookEntryDto[];
}

export type WebSocketResponseDto =
  | WebSocketOrderResponseDto
  | WebSocketSwapResponseDto
  | WebSocketTopOfBookResponseDto
  | WebSocketOrderBookSnapshotResponseDto
  | WebSocketOrderBookEntriesResponseDto;
