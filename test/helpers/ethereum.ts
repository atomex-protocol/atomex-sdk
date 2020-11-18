import Web3 from "web3";
import { AbiItem } from "web3-utils";
import config from "../../src/config.json";
import { EthereumHelpers } from "../../src/ethereum";

export const GetEthereumHelperInstance = (web3: Web3) => {
  return new EthereumHelpers(
    web3,
    config.contracts.ETH.abi as AbiItem[],
    config.contracts.ETH.testnet.address,
    config.rpc.ethereum.testnet.blockTime,
    config.contracts.ETH.testnet.gasLimit,
  );
};
