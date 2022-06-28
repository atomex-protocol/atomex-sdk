export interface Signer {
  getPublicKey(): Promise<string>;
  sign(message: string): Promise<string>;
}
