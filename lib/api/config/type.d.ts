import { TezosToolkit } from "@taquito/taquito";
import Web3 from "web3";
export interface EthereumSetup {
    contract: string;
    rpc: string;
    web3?: Web3;
}
export interface TezosSetup {
    contract: string;
    rpc: string;
    taquito?: TezosToolkit;
}
export interface Config {
    basePath: string;
    version: string;
    ethereum: EthereumSetup;
    tezos: TezosSetup;
}
