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
    expect(tx.contractAddr).toBe(config.currencies.ETH.contracts.testnet.address);
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
    expect(tx.contractAddr).toBe(config.currencies.ETH.contracts.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("buildRefundTransaction", () => {
    const tx = eth.buildRefundTransaction("0x00");
    expect(tx.amount).toBe(undefined);
    expect(tx.contractAddr).toBe(config.currencies.ETH.contracts.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("buildAddTransaction", () => {
    const tx = eth.buildAddTransaction("0x00", 1000);
    expect(tx.amount).toBe(1000);
    expect(tx.contractAddr).toBe(config.currencies.ETH.contracts.testnet.address);
    expect(tx.data).toBeDefined();
  });

  test("buildActivateTransaction", () => {
    const tx = eth.buildActivateTransaction("0x00");
    expect(tx.amount).toBe(undefined);
    expect(tx.contractAddr).toBe(config.currencies.ETH.contracts.testnet.address);
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
      "798ba2cf284d2edd7d302030511cab47c8c1025e73f2d4db751e098ac5e41c19",
      "0x080950fCc712749A236daBaBd528bbFb141eA484",
      45369500000000000,
      1604545434,
      5,
    );
    expect(data).toStrictEqual({
      status: "Confirmed",
      confirmations: 2051224,
      nextBlockETA: 1604546010,
    });

    //invalid details
    data = await eth.validateInitiateTransaction(
      1000,
      "txID",
      "798ba2cf284d2edd7d302030511cab47c8c1025e73f2d4db751e098ac5e41c191",
      "0x080950fCc712749A236daBaBd528bbFb141eA484",
      45369500000000000,
      1604545434,
      5,
    );
    expect(data).toStrictEqual({
      status: "Invalid",
      message: "Cannot read properties of null (reading 'to')",
      confirmations: 0,
      nextBlockETA: 0,
    });
  });

  test("parseInitiateParameters", () => {
    const params = eth.parseInitiateParameters(initiate_tx as Transaction);
    expect(params.secretHash).toBe(
      "798ba2cf284d2edd7d302030511cab47c8c1025e73f2d4db751e098ac5e41c19",
    );
    expect(params.refundTimestamp).toBe(1653657642920);
    expect(params.rewardForRedeem).toBe(0);
    expect(params.receivingAddress.toLowerCase()).toBe(
      "0x080950fcc712749a236dababd528bbfb141ea484".toLowerCase(),
    );
    expect(params.netAmount).toBe(45369500000000000);
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
    const expectedMinerFees = 121 * config.currencies.ETH.contracts.testnet.gasLimit;
    expect(fees).toStrictEqual({
      totalCost: expectedMinerFees,
      rewardForRedeem: 2 * expectedMinerFees,
    });
  });

  test("isValidAddress", () => {
    expect(eth.isValidAddress("0xc6d9d2cd449a754c494264e1809c50e34d64562b")).toBe(true);
    expect(eth.isValidAddress("c6d9d2cd449a754c494264e1809c50e34d64562b")).toBe(true);
    expect(eth.isValidAddress("0xE247A45c287191d435A8a5D72A7C8dc030451E9F")).toBe(true);
    expect(eth.isValidAddress("0xe247a45c287191d435a8a5d72a7c8dc030451e9f")).toBe(true);
    expect(eth.isValidAddress("0xE247A45C287191D435A8A5D72A7C8DC030451E9F")).toBe(true);
    expect(eth.isValidAddress("0XE247A45C287191D435A8A5D72A7C8DC030451E9F")).toBe(true);
    expect(eth.isValidAddress("0xE247a45c287191d435A8a5D72A7C8dc030451E9F")).toBe(false);
  });
});
