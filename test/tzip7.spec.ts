import { OperationContentsAndResultTransaction } from "@taquito/rpc";
import { TezosToolkit } from "@taquito/taquito";
import { GenerateMockRPCClient, GetTzBTCHelperInstance } from "./helpers/tezos";
import initiate_tx from "./data/tzip7_initiate_tx.json";
import config from "../src/config.json";

describe("Tzip7Helpers test", () => {
    const toolKit = new TezosToolkit(config.blockchains.tezos.rpc.testnet.rpc);
    toolKit["_context"].rpc = GenerateMockRPCClient("applied", 10000, 100, null);
    const tzbtc = GetTzBTCHelperInstance(toolKit);

    test("parseInitiateParameters", () => {
        const params = tzbtc.parseInitiateParameters(
            initiate_tx as OperationContentsAndResultTransaction,
        );
        expect(params.secretHash).toBe(
            "7b4bdf4e69fd6c17a0863dc6fa1c6ecd2ba2e905ab8482f801e2e9b8d9300723",
        );
        expect(params.receivingAddress).toBe(
            "tz1aKTCbAUuea2RV9kxqRVRg3HT7f1RKnp6a",
        );
        expect(params.refundTimestamp).toBe(1621243331);
        expect(params.netAmount).toBe(775549);
        expect(params.rewardForRedeem).toBe(0);
    });
});