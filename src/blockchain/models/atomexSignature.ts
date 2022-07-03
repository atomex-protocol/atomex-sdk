export interface AtomexSignature {
  readonly address: string;
  readonly algorithm: string;
  readonly publicKeyBytes: string;
  readonly signatureBytes: string;
}
