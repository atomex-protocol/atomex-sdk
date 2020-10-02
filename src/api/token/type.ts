export interface GetTokenRequest {
  timeStamp: string;
  nonce: string;
  publicKey: string;
  signature: string;
  algorithm: string;
  curve: string;
}
