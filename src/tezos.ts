import { ParameterSchema } from "@taquito/michelson-encoder";
import { TezosToolkit } from "@taquito/taquito";
import { BlockResponse, OperationContentsAndResultTransaction } from "@taquito/rpc";
import { InitiateParameters, PartialTransactionBody, SwapTransactionStatus, AuthMessage, Algorithm } from "./types";
import { Helpers, dt2ts, now } from "./helpers";
import config from "./config.json";

const formatTimestamp = (timestamp: number) => {
  return (new Date(timestamp * 1000)).toISOString().slice(0, -5) + "Z";
}

/**
 * Tezos Util class for Tezos related Atomex helper functions
 */
export class TezosHelpers implements Helpers {
  private _tezos: TezosToolkit;
  private _contractAddress: string;
  private _timeBetweenBlocks: number;
  private _entrypoints: Map<string, ParameterSchema>;

  constructor(
    tezos: TezosToolkit,
    entrypoints: Record<string, any>,
    contractAddress: string,
    timeBetweenBlocks: number,
  ) {
    this._tezos = tezos;
    this._contractAddress = contractAddress;
    this._timeBetweenBlocks = timeBetweenBlocks;
    this._entrypoints = new Map<string, ParameterSchema>(
      Object.entries(entrypoints).map(([name, typeExpr]) => {
          return [name, new ParameterSchema(typeExpr)];
      })
    );
  }

  /**
   * Connects to the supported tezos chain
   *
   * @param network networks supported by atomex, can be either mainnet or testnet
   * @param rpc optional rpc endpoint to create tezos chain client
   * @returns chain id of the connected chain
   */
  static async create(network: "mainnet" | "testnet", rpcUri?: string): Promise<TezosHelpers> {
    const networkSettings = config.rpc.tezos[network];
    if (rpcUri !== undefined) 
      networkSettings.rpc = rpcUri;

    const tezos = new TezosToolkit();
    tezos.setProvider({ rpc: networkSettings.rpc });

    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString())
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);

    return new TezosHelpers(
      tezos,
      config.contracts.XTZ.entrypoints,
      config.contracts.XTZ[network],
      config.rpc.tezos[network].blockTime,
    );
  }

  private getTezosAlgorithm(prefix?: string): Algorithm {
    switch (prefix) {
      case "tz1": return "Ed25519:Blake2b";
      case "tz2": return "Blake2bWithEcdsa:Secp256k1";
      case "tz3": return "Blake2bWithEcdsa:Secp256r1";
      default: throw new Error(`Unexpected address prefix: ${prefix}`);
    }
  }

  getAuthMessage(message: string, address: string): AuthMessage {
    const nowMillis = Date.now();
    return {
      message,
      timestamp: nowMillis,
      msgToSign: message + nowMillis.toString(),
      algorithm: this.getTezosAlgorithm(address.slice(0, 3)),
    };
  }

  buildInitiateTransaction(initiateParameters: InitiateParameters): PartialTransactionBody {
    if (initiateParameters.refundTimestamp < now())
      throw new Error(`Swap timestamp is in the past: ${initiateParameters.refundTimestamp}`);

    const parameter = this._entrypoints.get("initiate")?.Encode(
      initiateParameters.receivingAddress,
      initiateParameters.secretHash,
      formatTimestamp(initiateParameters.refundTimestamp),
      initiateParameters.rewardForRedeem,
    );
    return {
      data: {
        entrypoint: "initiate",
        value: parameter,
      },
      contractAddr: this._contractAddress,
      amount: initiateParameters.netAmount + initiateParameters.rewardForRedeem,
    };
  }

  buildRedeemTransaction(secret: string): PartialTransactionBody {
    return {
      data: {
        entrypoint: "redeem",
        value: this._entrypoints.get("redeem")?.Encode(secret),
      },
      contractAddr: this._contractAddress,
    };
  }
  
  buildRefundTransaction(secretHash: string): PartialTransactionBody {
    return {
      data: {
        entrypoint: "refund",
        value: this._entrypoints.get("refund")?.Encode(secretHash),
      },
      contractAddr: this._contractAddress,
    };
  }

  buildAddTransaction(secretHash: string, amount: number): PartialTransactionBody {
    return {
      amount,
      data: {
        entrypoint: "add",
        value: this._entrypoints.get("add")?.Encode(secretHash),
      },
      contractAddr: this._contractAddress,
    };
  }

  /**
   * Get Block endorsements and level
   *
   * @param blockLevel block level to identify the block
   * @returns endorsements , level of the block and block generation time
   */
  getBlockDetails(block: BlockResponse) {
    let numEndorsements = 0;
    block.operations.forEach((ops) => {
      ops.forEach((op) => {
        op.contents.forEach((content) => {
          if (
            content.kind !== "endorsement" ||
            !Object.prototype.hasOwnProperty.call(content, "metadata")
          )
            return;
          const metadata = Object.getOwnPropertyDescriptor(content, "metadata")
            ?.value;
          if (!Object.prototype.hasOwnProperty.call(metadata, "slots")) return;
          const slots = Object.getOwnPropertyDescriptor(metadata, "slots")
            ?.value as number[];
          numEndorsements += slots.length;
        });
      });
    });
    return {
      numEndorsements,
      level: block.metadata.level.level,
      timestamp: dt2ts(block.header.timestamp),
    };
  }

  parseInitiateParameters(content: OperationContentsAndResultTransaction): InitiateParameters {
    if (content.parameters === undefined)
      throw new Error("Parameters are undefined");

    const params = this._entrypoints.get(content.parameters.entrypoint)?.Execute(content.parameters.value);
    if (params === undefined)
      throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);

    const initiateParams = (() => {
      switch (content.parameters.entrypoint) {
        case "initiate": return params;
        case "fund": return params["initiate"];
        case "default": return params["fund"]["initiate"];
        default: throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
      }
    })();

    return {
      secretHash: initiateParams["settings"]["hashed_secret"],
      receivingAddress: initiateParams["participant"],
      refundTimestamp: dt2ts(initiateParams["settings"]["refund_time"]),
      netAmount: parseInt(content.amount) - parseInt(initiateParams["settings"]["payoff"]),
      rewardForRedeem: parseInt(initiateParams["settings"]["payoff"]),
    };
  }

  findContractCall(block: BlockResponse, txID: string): OperationContentsAndResultTransaction {
    const opg = block.operations[3]?.find((opg) => opg.hash == txID);
    if (opg === undefined)
      throw new Error(`Operation not found: ${txID} @ ${block.hash}`);

    const content = <OperationContentsAndResultTransaction>(opg.contents.find(
      (c) => c.kind == "transaction" && c.destination == this._contractAddress)
    );
    if (content === undefined)
      throw new Error(`Unsupported contract version is used`);

    return content as OperationContentsAndResultTransaction;
  }

  async validateInitiateTransaction(
    blockHeight: number,
    txID: string,
    secretHash: string,
    receivingAddress: string,
    netAmount: number,
    minRefundTimestamp: number,
    minConfirmations = 5,
  ): Promise<SwapTransactionStatus> {
    const block = await this._tezos.rpc.getBlock({
      block: blockHeight.toString(),
    });

    try {
      const initiateParameters = this.parseInitiateParameters(this.findContractCall(block, txID));
      if (initiateParameters.secretHash !== secretHash)
        throw new Error(`Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}`);

      if (initiateParameters.receivingAddress !== receivingAddress)
        throw new Error(`Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}`);

      if (initiateParameters.netAmount !== netAmount)
        throw new Error(`Net amount: expect ${netAmount}, actual ${initiateParameters.netAmount}`);

      if (initiateParameters.refundTimestamp < minRefundTimestamp)
        throw new Error(`Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}`);
    } catch (e) {
      return {
        status: "Invalid",
        message: e.message,
        confirmations: 0,
        nextBlockETA: 0,
      };
    }

    const headDetails = this.getBlockDetails(
      await this._tezos.rpc.getBlock({ block: "head" }),
    );
    const txBlockDetails = this.getBlockDetails(block);
    const confirmations = headDetails.level - txBlockDetails.level;

    const res: SwapTransactionStatus = {
      status: "Included",
      confirmations: confirmations,
      nextBlockETA: headDetails.timestamp + this._timeBetweenBlocks,
    };

    if (confirmations >= minConfirmations 
      || headDetails.numEndorsements === 32 
      || txBlockDetails.numEndorsements === 32) {
      res.status = "Confirmed";
    }

    return res;
  }
}
