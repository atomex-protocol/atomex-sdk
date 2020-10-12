export interface SwapDetails {
  hashedSecret: string;
  participant: string;
  refundTimestamp: number;
  countdown?: number;
  payoff: number;
  active?: boolean;
}
export interface ExpectedSwapData {
  _amount: string;
  _hashedSecret: string;
  _participant: string;
  _refundTimestamp: number;
  _payoff: string;
  _active?: boolean;
}

export interface SwapValidity {
  status: "Confirmed" | "Included" | "Invalid";
  confirmations: string;
  next_block_ts: string;
}
