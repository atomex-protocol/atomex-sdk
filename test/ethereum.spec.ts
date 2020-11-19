import Web3 from "web3";
import { Transaction } from "web3-core";
// @ts-ignore
import FakeProvider from "web3-fake-provider";
import config from "../src/config.json";
import { now } from "../src/helpers";
import initiate_tx from "./data/eth_initiate_tx.json";
import { GetEthereumHelperInstance } from "./helpers/ethereum";

describe("EthereumHelpers test", () => {
  const provider = new FakeProvider();
  const web3 = new Web3();
  web3.setProvider(provider);
  const eth = GetEthereumHelperInstance(web3);

  test("buildInitiateTransaction", () => {
    const tx = eth.buildInitiateTransaction({
      netAmount: 100,
      receivingAddress: "0x993E67d0A90ed59aA65756099eB5d7857E56021b",
      refundTimestamp: now() + 7200,
      rewardForRedeem: 10,
      secretHash: "00",
    });
    expect(tx.amount).toBe(110);
    expect(tx.contractAddr).toBe(config.contracts.ETH.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("getAuthMessage", () => {
    const t1 = Date.now();
    const data = eth.getAuthMessage(
      "HelloWorld",
      "0x993E67d0A90ed59aA65756099eB5d7857E56021b",
    );
    const t2 = Date.now();
    expect(data.algorithm).toBe("Keccak256WithEcdsa:Geth2940");
    expect(data.message).toBe("HelloWorld");
    expect(data.timestamp >= t1 && data.timestamp <= t2).toBe(true);
    expect(data.msgToSign).toBe("HelloWorld" + data.timestamp.toString());
  });

  test("buildRedeemTransaction", () => {
    const tx = eth.buildRedeemTransaction("0x00", "0x00");
    expect(tx.amount).toBe(undefined);
    expect(tx.contractAddr).toBe(config.contracts.ETH.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("buildRefundTransaction", () => {
    const tx = eth.buildRefundTransaction("0x00");
    expect(tx.amount).toBe(undefined);
    expect(tx.contractAddr).toBe(config.contracts.ETH.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("buildAddTransaction", () => {
    const tx = eth.buildAddTransaction("0x00", 1000);
    expect(tx.amount).toBe(1000);
    expect(tx.contractAddr).toBe(config.contracts.ETH.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("buildActivateTransaction", () => {
    const tx = eth.buildActivateTransaction("0x00");
    expect(tx.amount).toBe(undefined);
    expect(tx.contractAddr).toBe(config.contracts.ETH.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("recoverPublicKey", () => {
    const pubKey = eth.recoverPublicKey(
      "Signing in 1604674558300",
      "0xda026bc6ff1a6aaa0838b930a9385c3eed6330c9858b0f8d175ce135376082190163416128cb97a2aed4e8bb98bb2a2fc2b0b4dd69b8595fd7ca8b0388a1076c1c",
    );
    expect(pubKey).toBe(
      "0x0492c4d2894b93d64189d6e2fc660e9090622148f8088c4bd967879d32ed438f9178852b4d34a23021da02b07ff7acc1ffb29404fd268f1c8cea7f92bfc24fdc48",
    );
  });

  test("validateInitiateTransaction", async () => {
    provider.injectResult(initiate_tx as Transaction);
    provider.injectResult({ number: 9009040, timestamp: 1604546000 });
    let data = await eth.validateInitiateTransaction(
      1000,
      "txID",
      "e0f9d71ecb40fa22b0146e8e8b1668a0cce1d3651c421ec1f8a344353320cb77",
      "0x9ffDD2871e06Df76E7245b8Be91E2af409F37Eda",
      35369500000000000,
      1604545434,
      5,
    );
    expect(data).toStrictEqual({
      status: "Confirmed",
      confirmations: 10,
      nextBlockETA: 1604546010,
    });

    //invalid details
    data = await eth.validateInitiateTransaction(
      1000,
      "txID",
      "e0f971ecb40fa22b0146e8e8b1668a0cce1d3651c421ec1f8a344353320cb77",
      "0x9ffDD2871e06Df76E7245b8Be91E2af409F37Eda",
      35369500000000000,
      1604545434,
      5,
    );
    expect(data).toStrictEqual({
      status: "Invalid",
      message: "Cannot read property 'to' of null",
      confirmations: 0,
      nextBlockETA: 0,
    });
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

  test("encodeSignature", () => {
    const encoded = eth.encodeSignature(
      "0xda026bc6ff1a6aaa0838b930a9385c3eed6330c9858b0f8d175ce135376082190163416128cb97a2aed4e8bb98bb2a2fc2b0b4dd69b8595fd7ca8b0388a1076c1c",
    );
    expect(encoded).toBe(
      "da026bc6ff1a6aaa0838b930a9385c3eed6330c9858b0f8d175ce135376082190163416128cb97a2aed4e8bb98bb2a2fc2b0b4dd69b8595fd7ca8b0388a1076c",
    );
  });

  test("encodePublicKey", () => {
    const encoded = eth.encodePublicKey(
      "0x0492c4d2894b93d64189d6e2fc660e9090622148f8088c4bd967879d32ed438f9178852b4d34a23021da02b07ff7acc1ffb29404fd268f1c8cea7f92bfc24fdc48",
    );
    expect(encoded).toBe(
      "0492c4d2894b93d64189d6e2fc660e9090622148f8088c4bd967879d32ed438f9178852b4d34a23021da02b07ff7acc1ffb29404fd268f1c8cea7f92bfc24fdc48",
    );
  });

  test("estimateInitiateFees", async () => {
    provider.injectResult(121); //getGasPrice
    provider.injectResult(12200); //estimateGas
    const fees = await eth.estimateInitiateFees(
      "0x0000000000000000000000000000000000000000",
    );
    expect(fees).toBe(121 * 12200);
  });

  test("estimateRedeemFees", async () => {
    provider.injectResult(121); //getGasPrice
    const fees = await eth.estimateRedeemFees(
      "0x0000000000000000000000000000000000000000",
    );
    const expectedMinerFees = 121 * config.contracts.ETH.testnet.gasLimit;
    expect(fees).toStrictEqual({
      totalCost: expectedMinerFees,
      rewardForRedeem: 2 * expectedMinerFees,
    });
  });
});
