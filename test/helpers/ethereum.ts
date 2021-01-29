import Web3 from "web3";
import { AbiItem } from "web3-utils";
import config from "../../src/config.json";
import { EthereumHelpers } from "../../src/ethereum";

export const GetEthereumHelperInstance = (web3: Web3) => {
  return new EthereumHelpers(
    web3,
    config.currencies.ETH.contracts.abi as AbiItem[],
    config.currencies.ETH.contracts.testnet.address,
    config.blockchains.ethereum.rpc.testnet.blockTime,
    config.currencies.ETH.contracts.testnet.gasLimit,
  );
};
