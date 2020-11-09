import { TezosHelpers } from "../src/tezos";
import { now } from "../src/helpers";
import config from "../src/config.json";
import initiate_tx_default from "./data/initiate_tx_default.json";
import { TezosToolkit } from "@taquito/taquito";
import { OperationContentsAndResultTransaction } from "@taquito/rpc";

describe("TezosHelpers test", () => {
  const tezos = new TezosHelpers(
    new TezosToolkit(),
    config.contracts.XTZ.entrypoints,
    "KT1DEpTxK2qyFhTCT2QCZ1Ly4f43YVNbzHP1",
    0
  );

  test("buildInitiateTransaction", () => {    
    const tx = tezos.buildInitiateTransaction({
      netAmount: 100,
      receivingAddress: "tz1isqXSvxggGWucBGkWMvUu9834RPYtQnxQ",
      refundTimestamp: now() + 7200,
      rewardForRedeem: 10,
      secretHash: "00"
    });

    expect(tx.amount).toBe(110);
    expect(tx.contractAddr).toBe("KT1DEpTxK2qyFhTCT2QCZ1Ly4f43YVNbzHP1");
    expect(tx.data?.entrypoint).toBe("initiate");
  });

  test("parseInitiateParameters", () => {
    const content = initiate_tx_default as OperationContentsAndResultTransaction;
    const params = tezos.parseInitiateParameters(content);
    expect(params.secretHash).toBe("e03f5c31bb7ef5cf87f2e06048d3fa1000e81f8f56957498c9aca8bbc1c070b2");
    expect(params.receivingAddress).toBe("tz1aKTCbAUuea2RV9kxqRVRg3HT7f1RKnp6a");
    expect(params.refundTimestamp).toBe(1604961711);
    expect(params.netAmount).toBe(194992828);
    expect(params.rewardForRedeem).toBe(0);
  });
});