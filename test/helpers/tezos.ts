import { TezosToolkit } from "@taquito/taquito";
import config from "../../src/config.json";
import { TezosHelpers } from "../../src/tezos";
import block_data from "../data/tezos_block_data.json";
export const GenerateMockRPCClient = (
  status: string,
  gas: number,
  storageDiff: number,
  revealedKey: string | null,
) => {
  const mockRpcClient = {
    getManagerKey: jest.fn(),
    getBlockHeader: jest.fn(),
    getContract: jest.fn(),
    runOperation: jest.fn(),
    getBlock: jest.fn(),
  };
  mockRpcClient.getContract.mockResolvedValue({ counter: "0" });
  mockRpcClient.getBlockHeader.mockResolvedValue({ hash: "test" });
  mockRpcClient.runOperation.mockResolvedValue({
    contents: [
      {
        metadata: {
          operation_result: {
            status: status,
            consumed_gas: gas.toString(),
            paid_storage_size_diff: storageDiff.toString(),
          },
        },
      },
    ],
  });
  mockRpcClient.getManagerKey.mockResolvedValue(revealedKey);
  mockRpcClient.getBlock.mockResolvedValue(block_data);
  return mockRpcClient;
};

export const GetTezosHelperInstance = (toolKit: TezosToolkit) => {
  return new TezosHelpers(
    toolKit,
    config.currencies.XTZ.contracts.entrypoints,
    config.currencies.XTZ.contracts.testnet.address,
    config.blockchains.tezos.rpc.testnet.blockTime,
    config.currencies.XTZ.contracts.testnet.gasLimit,
    config.blockchains.tezos.rpc.testnet.minimalFees,
    config.blockchains.tezos.rpc.testnet.minimalNanotezPerGasUnit,
    config.blockchains.tezos.rpc.testnet.minimalNanotezPerByte,
    config.blockchains.tezos.rpc.testnet.costPerByte,
    config.currencies.XTZ.contracts.testnet.redeemTxSize,
    config.currencies.XTZ.contracts.testnet.initiateTxSize,
  );
};
