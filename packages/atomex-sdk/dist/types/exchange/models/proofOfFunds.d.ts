export declare type ProofOfFundsAlgorithm = 'Ed25519' | 'Ed25519:Blake2b' | 'Sha256WithEcdsa:Secp256k1' | 'Blake2bWithEcdsa:Secp256k1' | 'Blake2bWithEcdsa:Secp256r1' | 'Keccak256WithEcdsa:Geth2940' | 'Sha256WithEcdsa:BtcMsg';
export interface ProofOfFunds {
    address: string;
    currency: string;
    timeStamp: number;
    message: string;
    publicKey: string;
    signature: string;
    algorithm: ProofOfFundsAlgorithm;
}
