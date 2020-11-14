import { OperationContentsAndResultTransaction } from "@taquito/rpc";
import { TezosToolkit } from "@taquito/taquito";
import config from "../src/config.json";
import { now } from "../src/helpers";
import { TezosHelpers } from "../src/tezos";
import initiate_tx_default from "./data/tez_initiate_tx_default.json";

describe("TezosHelpers test", () => {
  const tez = new TezosHelpers(
    new TezosToolkit(),
    config.contracts.XTZ.entrypoints,
    config.contracts.XTZ.testnet,
    config.rpc.tezos.testnet.blockTime,
    config.rpc.tezos.testnet.gasLimit,
    config.rpc.tezos.testnet.minimalFees,
    config.rpc.tezos.testnet.minimalNanotezPerGasUnit,
    config.rpc.tezos.testnet.minimalNanotezPerByte,
  );

  test("buildInitiateTransaction", () => {
    const tx = tez.buildInitiateTransaction({
      netAmount: 100,
      receivingAddress: "tz1isqXSvxggGWucBGkWMvUu9834RPYtQnxQ",
      refundTimestamp: now() + 7200,
      rewardForRedeem: 10,
      secretHash: "00",
    });

    expect(tx.amount).toBe(110);
    expect(tx.contractAddr).toBe(config.contracts.XTZ.testnet);
    expect(tx.data?.entrypoint).toBe("initiate");
  });

  test("parseInitiateParameters", () => {
    const content = initiate_tx_default as OperationContentsAndResultTransaction;
    const params = tez.parseInitiateParameters(content);
    expect(params.secretHash).toBe(
      "e03f5c31bb7ef5cf87f2e06048d3fa1000e81f8f56957498c9aca8bbc1c070b2",
    );
    expect(params.receivingAddress).toBe(
      "tz1aKTCbAUuea2RV9kxqRVRg3HT7f1RKnp6a",
    );
    expect(params.refundTimestamp).toBe(1604961711);
    expect(params.netAmount).toBe(194992828);
    expect(params.rewardForRedeem).toBe(0);
  });
});
