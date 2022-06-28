export interface Currency {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly blockchain: string;
  readonly type: string;
  readonly decimals: number;
}
