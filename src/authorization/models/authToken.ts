export interface AuthToken {
  readonly value: string;
  readonly userId: string;
  readonly address: string;
  readonly expired: Date;
}
