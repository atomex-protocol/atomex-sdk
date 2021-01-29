export type Side = "Buy" | "Sell";

export type Sort = "Asc" | "Desc";

export type TxType = "Lock" | "AdditionalLock" | "Redeem" | "Refund";

export type OrderType =
  | "Return"
  | "FillOrKill"
  | "SolidFillOrKill"
  | "ImmediateOrCancel";

export type OrderStatus = "Pending" | "Confirmed" | "Canceled";

export type PartyStatus =
  | "Created"
  | "Involved"
  | "PartiallyInitiated"
  | "Initiated"
  | "Redeemed"
  | "Refunded"
  | "Lost"
  | "Jackpot";

export type TxStatus =
  | "Pending"
  | "Placed"
  | "PartiallyFilled"
  | "Filled"
  | "Canceled"
  | "Rejected";

export type Algorithm =
  | "Ed25519"
  | "Ed25519:Blake2b"
  | "Sha256WithEcdsa:Secp256k1"
  | "Blake2bWithEcdsa:Secp256k1"
  | "Blake2bWithEcdsa:Secp256r1"
  | "Keccak256WithEcdsa:Geth2940"
  | "Sha256WithEcdsa:BtcMsg";

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
  timeStamp: number;
  message: string;
  publicKey: string;
  signature: string;
  algorithm: Algorithm;
}

export interface AddOrderRequest {
  clientOrderId: string;
  symbol: string;
  price: number;
  qty: number;
  side: Side;
  type: OrderType;
  proofsOfFunds: ProofOfFunds[];
  requisites?: SwapRequisites;
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
  status: TxStatus;
  type: TxType;
}

export interface UserSwapData {
  requisites: SwapRequisites;
  status: PartyStatus;
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
  status: OrderStatus;
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

export interface AddSwapRequisites {
  secretHash?: string;
  receivingAddress: string;
  refundAddress?: string;
  rewardForRedeem?: number;
  lockTime: number;
}

export interface AuthTokenRequest {
  timeStamp: number;
  message: string;
  publicKey: string;
  signature: string;
  algorithm: Algorithm;
}

export interface AuthTokenResponse {
  id: string;
  token: string;
  expires: number;
}

export interface SymbolData {
  name: string;
  minimumQty: number;
}

export interface InitiateParameters {
  secretHash: string;
  receivingAddress: string;
  netAmount: number;
  rewardForRedeem: number;
  refundTimestamp: number;
  countdown?: number;
  active?: boolean;
}

export interface PartialTransactionBody {
  contractAddr: string;
  data: any;
  amount?: number;
}

export interface SwapTransactionStatus {
  status: "Confirmed" | "Pending" | "Included" | "Invalid";
  message?: string;
  confirmations: number;
  nextBlockETA: number;
}

export interface AuthMessage {
  timestamp: number;
  message: string;
  msgToSign: string;
  algorithm: Algorithm;
}

export interface OrderPreview {
  price: number;
  amountSent: number;
  amountReceived: number;
}

export interface RedeemFees {
  totalCost: number;
  rewardForRedeem: number;
}

export interface CurrencyConfig {
  blockchain: string;
  decimals: number;
  displayDecimals: number;
  contractAddress: string;
}