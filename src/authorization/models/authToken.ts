export interface AuthToken {
  readonly value: string;
  readonly userId: string;
  readonly expired: Date;
}
