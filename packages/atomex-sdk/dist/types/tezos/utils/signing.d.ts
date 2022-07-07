export declare const getRawSigningData: (message: string) => string;
export declare const getRawMichelineSigningData: (message: string) => string;
export declare const getWalletMichelineSigningData: (message: string) => string;
export declare const getTezosSigningAlgorithm: (addressOrPublicKey: string) => "Ed25519:Blake2b" | "Blake2bWithEcdsa:Secp256k1" | "Blake2bWithEcdsa:Secp256r1";
export declare const decodeSignature: (signature: string) => string;
