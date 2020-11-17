import Web3 from "web3";
import { Transaction } from "web3-core";
import { AbiItem } from "web3-utils";
import config from "../src/config.json";
import { EthereumHelpers } from "../src/ethereum";
import { now } from "../src/helpers";
import initiate_tx from "./data/eth_initiate_tx.json";

describe("EthereumHelpers test", () => {
  const eth = new EthereumHelpers(
    new Web3(),
    config.contracts.ETH.abi as AbiItem[],
    config.contracts.ETH.testnet.address,
    config.rpc.ethereum.testnet.blockTime,
    config.contracts.ETH.testnet.gasLimit,
  );

  test("buildInitiateTransaction", () => {
    const tx = eth.buildInitiateTransaction({
      netAmount: 100,
      receivingAddress: "0x993E67d0A90ed59aA65756099eB5d7857E56021b",
      refundTimestamp: now() + 7200,
      rewardForRedeem: 10,
      secretHash: "00",
    });
    expect(tx.amount).toBe(110);
    expect(tx.contractAddr).toBe(config.contracts.ETH.testnet);
    expect(tx.data).toBeDefined();
  });

  test("parseInitiateParameters", () => {
    const params = eth.parseInitiateParameters(initiate_tx as Transaction);
    expect(params.secretHash).toBe(
      "e0f9d71ecb40fa22b0146e8e8b1668a0cce1d3651c421ec1f8a344353320cb77",
    );
    expect(params.refundTimestamp).toBe(1604545434);
    expect(params.rewardForRedeem).toBe(10000000000000000);
    expect(params.receivingAddress.toLowerCase()).toBe(
      "0x9ffDD2871e06Df76E7245b8Be91E2af409F37Eda".toLowerCase(),
    );
    expect(params.netAmount).toBe(45369500000000000 - 10000000000000000);
  });
});
