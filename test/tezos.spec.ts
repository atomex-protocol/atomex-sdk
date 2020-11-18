import { OperationContentsAndResultTransaction } from "@taquito/rpc";
import { TezosToolkit } from "@taquito/taquito";
import config from "../src/config.json";
import { now } from "../src/helpers";
import initiate_tx_default from "./data/tez_initiate_tx_default.json";
import { GenerateMockRPCClient, GetTezosHelperInstance } from "./helpers/tezos";

describe("TezosHelpers test", () => {
  const toolKit = new TezosToolkit();
  toolKit["_context"].rpc = GenerateMockRPCClient("applied", 10000, 100, null);
  const tez = GetTezosHelperInstance(toolKit);

  test("buildInitiateTransaction", () => {
    const tx = tez.buildInitiateTransaction({
      netAmount: 100,
      receivingAddress: "tz1isqXSvxggGWucBGkWMvUu9834RPYtQnxQ",
      refundTimestamp: now() + 7200,
      rewardForRedeem: 10,
      secretHash: "00",
    });

    expect(tx.amount).toBe(110);
    expect(tx.contractAddr).toBe(config.contracts.XTZ.testnet.address);
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

  test("encodeSignature", () => {
    let encoded = tez.encodeSignature(
      "edsigtzLBGCyadERX1QsYHKpwnxSxEYQeGLnJGsSkHEsyY8vB5GcNdnvzUZDdFevJK7YZQ2ujwVjvQZn62ahCEcy74AwtbA8HuN",
    );
    expect(encoded).toBe(
      "cabde71255b1f1674182cb7f8000903909dbe6dbb6a76afd3376c08a4f827b2bc938ed447f3e592766e89aea89fecfd1e8c8e82c71f60271cd08ac012262d603",
    );
    encoded = tez.encodeSignature(
      "spsig1RriZtYADyRhyNoQMa6AiPuJJ7AUDcrxWZfgqexzgANqMv4nXs6qsXDoXcoChBgmCcn2t7Y3EkJaVRuAmNh2cDDxWTdmsz",
    );
    expect(encoded).toBe(
      "993bce003ff00effd092baaefd31474639cdb0e86ec3dd2b605d2865cd8b92d67e9e02b4e5549c2436d1daeeb18a2a8b6c9c3e8f213400a29bfa08a9ace55a06",
    );
    encoded = tez.encodeSignature(
      "p2signmC9s4SiDeMggfipq2Y1P3sz8sEEh4Dr3P5XHQ1imsyz9tSRpQQKgiTGzQ5Bfbs9tRyvPhV59rMjhbgG8Xa4wtoMgRnd5",
    );
    expect(encoded).toBe(
      "c29b03c206b2a44675596e4fe15d4320840f50af5415b4a1f96ed427ffd0457446866e63a96e823ec65bdb34a7d89726b50440265b97507a4f27dfce16996f9a",
    );
    encoded = tez.encodeSignature(
      "sigQVTY9CkYw8qL6Xa7QWestkLSdtPv6HZ4ToSMHDcRot3BwRGwZhSwXd9jJwKkDvvotTLSNWQdUqiDSfXuCNUfjbEaY2j6j",
    );
    expect(encoded).toBe(
      "13216a89c0ab77152c24d898792424b03b6f13e3f79323015cfe47e83a8766e4716f34ea83e0cd8efbc0ada95ba5a9d49e290961a8f8d6141c012e45b290e234",
    );
  });

  test("encodePublicKey", () => {
    let encoded = tez.encodePublicKey(
      "edpku976gpuAD2bXyx1XGraeKuCo1gUZ3LAJcHM12W1ecxZwoiu22R",
    );
    expect(encoded).toBe(
      "419491b1796b13d756d394ed925c10727bca06e97353c5ca09402a9b6b07abcc",
    );
    encoded = tez.encodePublicKey(
      "sppk7aMNM3xh14haqEyaxNjSt7hXanCDyoWtRcxF8wbtya859ak6yZT",
    );
    expect(encoded).toBe(
      "0289e69b581187dba9ecfcaebe6874b445349ec0ef263760ea7b31f597a7d9d903",
    );
    encoded = tez.encodePublicKey(
      "p2pk679D18uQNkdjpRxuBXL5CqcDKTKzsiXVtc9oCUT6xb82zQmgUks",
    );
    expect(encoded).toBe(
      "03526cd78c46739469a968cfc2985109b4e3b92419ed5bcca5fdf3352c4425590e",
    );
  });

  test("calcFees", () => {
    const fees = tez.calcFees(1000, 100, 121);
    const expectedFees = 100 + 0.1 * 1000 + 1 * 121 + 100 * 250;
    expect(fees).toBe(expectedFees);
  });

  test("estimateInitiateFees", async () => {
    const fees = await tez.estimateInitiateFees("address");
    const expectedFees = tez.calcFees(
      10000,
      100,
      config.contracts.XTZ.testnet.initiateTxSize,
    );
    expect(fees).toBe(expectedFees);
  });

  test("estimateRedeemFees", async () => {
    // not revealed accounts
    let fees = await tez.estimateRedeemFees("address");
    let expectedMinerFees =
      tez.calcFees(
        config.contracts.XTZ.testnet.gasLimit,
        0,
        config.contracts.XTZ.testnet.redeemTxSize,
      ) +
      257 * config.rpc.tezos.testnet.costPerByte;
    expect(fees).toStrictEqual({
      totalCost: expectedMinerFees,
      rewardForRedeem: 2 * expectedMinerFees,
    });

    // revealed accounts
    const toolKitNew = new TezosToolkit();
    toolKitNew["_context"].rpc = GenerateMockRPCClient(
      "applied",
      10000,
      100,
      "public key",
    );
    const tezNew = GetTezosHelperInstance(toolKitNew);
    fees = await tezNew.estimateRedeemFees("address");
    expectedMinerFees = tez.calcFees(
      config.contracts.XTZ.testnet.gasLimit,
      0,
      config.contracts.XTZ.testnet.redeemTxSize,
    );
    expect(fees).toStrictEqual({
      totalCost: expectedMinerFees,
      rewardForRedeem: 2 * expectedMinerFees,
    });
  });
});
