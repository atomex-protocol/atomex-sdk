export interface AuthenticationRequestData {
  readonly message: string;
  readonly timeStamp: number;
  readonly publicKey: string;
  readonly signature: string;
  readonly algorithm: string;
  readonly signingDataType?: string;
}
