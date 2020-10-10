export type Side = "Buy" | "Sell";
export type Sort = "Asc" | "Desc";
export type TxType = "Lock" | "AdditionalLock" | "Redeem" | "Refund";
export type OrderType =
  | "Return"
  | "FillOrKill"
  | "SolidFillOrKill"
  | "ImmediateOrCancel";
export type Status =
  | "Pending"
  | "Placed"
  | "PartiallyFilled"
  | "Filled"
  | "Canceled"
  | "Rejected";
export interface BookQuote {
  symbol: string;
  timeStamp: string;
  bid: number;
  ask: number;
}
export interface Entry {
  side: Side;
  price: number;
  qtyProfile: number[];
}
export interface OrderBook {
  updateId: number;
  symbol: string;
  entries: Entry[];
}

export interface ProofOfFunds {
  address: string;
  currency: string;
  timeStamp: string;
  nonce: string;
  publicKey: string;
  signature: string;
}

export interface AddOrderRequisites {
  secretHash?: string;
  receivingAddress: string;
  refundAddress?: string;
  rewardForRedeem: number;
  lockTime: number;
}

export interface AddOrderRequest {
  clientOrderId: string;
  symbol: string;
  price: number;
  qty: number;
  side: Side;
  type: OrderType;
  proofOfFunds: ProofOfFunds[];
  requisites: AddOrderRequisites;
}

export interface GetOrdersRequest {
  symbols?: string;
  sort?: Sort;
  offset?: number;
  limit?: number;
  active?: boolean;
}

export interface Trade {
  orderId: number;
  price: number;
  qty: number;
}

export interface Transaction {
  currency: string;
  txId: string;
  blockHeight: number;
  confirmations: number;
  status: Status;
  type: TxType;
}

export interface UserSwapData {
  requisites: SwapRequisites;
  status: Status;
  trades: Trade[];
  transactions: Transaction[];
}
export interface Swap {
  id: number;
  symbol: string;
  side: Side;
  timeStamp: string;
  price: number;
  qty: number;
  secret: string;
  secretHash: string;
  isInitiator: boolean;
  user: UserSwapData;
  counterParty: UserSwapData;
}
export interface Order {
  id: number;
  clientOrderId: string;
  symbol: string;
  side: Side;
  timeStamp: string;
  price: number;
  qty: number;
  leaveQty: number;
  type: OrderType;
  status: Status;
  trades: Trade[];
  swaps: Swap[];
}

export interface GetSwapsRequest {
  symbols?: string;
  sort?: Sort;
  offset?: number;
  limit?: number;
  active?: boolean;
  completed?: boolean;
}

export interface SwapRequisites {
  secretHash?: string;
  receivingAddress: string;
  refundAddress?: string;
  rewardForRedeem: number;
  lockTime: number;
}

export interface GetTokenRequest {
  timeStamp: number;
  message: string;
  publicKey: string;
  signature: string;
  algorithm: string;
  curve: string;
}

export interface AuthResponse {
  id: string;
  token: string;
  expires: string;
}

export interface SymbolData {
  name: string;
  minimumQty: number;
}
