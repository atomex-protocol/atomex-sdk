export type Side = "Buy" | "Sell";

export interface ProofOfFunds {
  address: string;
  currency: string;
  timeStamp: string;
  nonce: string;
  publicKey: string;
  signature: string;
}

export interface AddOrderRequisites {
  secretHash: string;
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
  type: "Return" | "FillOrKill" | "ImmediateOrCancel";
  proofOfFunds: ProofOfFunds[];
  requisites: AddOrderRequisites;
}

export interface GetOrdersRequest {
  symbols?: string;
  sort?: "Desc" | "Asc";
  offset?: number;
  limtit?: number;
  active?: boolean;
}
