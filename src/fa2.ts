import { TezosHelpers } from "./tezos";
import { OperationContentsAndResultTransaction } from "@taquito/rpc";
import { InitiateParameters, Network, TezosBasedCurrency } from "./types";
import { dt2ts } from "./helpers";
import config from "./config.json";
import { TezosToolkit } from "@taquito/taquito";

export class FA2Helpers extends TezosHelpers {

  /**
   * Connects to the supported tezos chain
   *
   * @param network networks supported by atomex, can be either mainnet or testnet
   * @param currency FA2 token symbol
   * @param rpc optional rpc endpoint to create tezos chain client
   * @returns chain id of the connected chain
   */
  static async create(
    network: Network,
    currency: TezosBasedCurrency,
    rpcUri?: string,
  ): Promise<TezosHelpers> {
    const networkSettings = config.blockchains.tezos.rpc[network];
    if (rpcUri !== undefined) {
      networkSettings.rpc = rpcUri;
    }

    const tezos = new TezosToolkit(networkSettings.rpc);
    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString()) {
      throw new Error(
        `Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`,
      );
    }

    return new FA2Helpers(
      tezos,
      config.currencies[currency].contracts.entrypoints,
      config.currencies[currency].contracts[network].address,
      config.blockchains.tezos.rpc[network].blockTime,
      config.currencies[currency].contracts[network].gasLimit,
      config.blockchains.tezos.rpc[network].minimalFees,
      config.blockchains.tezos.rpc[network].minimalNanotezPerGasUnit,
      config.blockchains.tezos.rpc[network].minimalNanotezPerByte,
      config.blockchains.tezos.rpc[network].costPerByte,
      config.currencies[currency].contracts[network].redeemTxSize,
      config.currencies[currency].contracts[network].initiateTxSize,
    );
  }

  parseInitiateParameters(content: OperationContentsAndResultTransaction): InitiateParameters {
    if (!content.parameters) {
      throw new Error("Parameters are undefined");
    }

    const params = this._entrypoints.get(content.parameters.entrypoint)?.Execute(content.parameters.value);
    if (!params) {
      throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
    }

    const initiateParams = this.getInitiateParams(content.parameters.entrypoint, params);

    return {
      // TODO: return tokenAddress and tokenId
      secretHash: initiateParams["hashedSecret"],
      receivingAddress: initiateParams["participant"],
      refundTimestamp: dt2ts(initiateParams["refundTime"]),
      netAmount: parseInt(initiateParams["totalAmount"]),
      rewardForRedeem: 0
    };
  }

  private getInitiateParams(entrypoint: string, params: any) {
    switch (entrypoint) {
      case "initiate":
        return params;
      case "default":
        return params["initiate"];
      default:
        throw new Error(
          `Unexpected entrypoint: ${entrypoint}`,
        );
    }
  }
}