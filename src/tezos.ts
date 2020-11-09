import { ParameterSchema } from "@taquito/michelson-encoder";
import { TezosToolkit } from "@taquito/taquito";
import { BlockResponse, OperationContentsAndResultTransaction } from "@taquito/rpc";
import { InitiateParameters, PartialTransactionBody, SwapTransactionStatus, AuthMessage, Algorithm } from "./types";
import { Helpers, dt2ts, now } from "./helpers";
import config from "./config.json";

/**
 * Tezos Util class for Tezos related Atomex helper functions
 */
export class TezosHelpers implements Helpers {
  private _tezos: TezosToolkit;
  private _entrypoints: Map<string, ParameterSchema>;
  private _contractAddress: string;
  private _timeBetweenBlocks: number;

  constructor(
    tezos: TezosToolkit, 
    entrypoints: Map<string, ParameterSchema>,
    contractAddress: string,
    timeBetweenBlocks: number) {
    this._tezos = tezos;
    this._entrypoints = entrypoints;
    this._contractAddress = contractAddress;
    this._timeBetweenBlocks = timeBetweenBlocks;
  }

  /**
   * Connects to the supported tezos chain
   *
   * @param network networks supported by atomex, can be either mainnet or testnet
   * @param rpc optional rpc endpoint to create tezos chain client
   * @returns chain id of the connected chain
   */
  static async create(network: "mainnet" | "testnet", rpcUri?: string) : Promise<TezosHelpers> {
    const networkSettings = config.rpc.tezos[network];
    if (rpcUri !== undefined) 
      networkSettings.rpc = rpcUri;

    const tezos = new TezosToolkit();
    tezos.setProvider({ rpc: networkSettings.rpc });

    const chainID = await tezos.rpc.getChainId();
    if (networkSettings.chainID !== chainID.toString())
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);

    const entrypoints = new Map<string, ParameterSchema>(
      Object.entries(config.contracts.XTZ.entrypoints).map(([name, typeExpr]) => {
        return [name, new ParameterSchema(typeExpr)];
      }),
    );

    return new TezosHelpers(
      tezos,
      entrypoints,
      config.contracts.XTZ[network],
      config.rpc.tezos[network].blockTime
    );
  }

  private getTezosAlgorithm (prefix?: string) : Algorithm {
    switch (prefix) {
      case "tz1": return "Ed25519:Blake2b";
      case "tz2": return "Blake2bWithEcdsa:Secp256k1";
      case "tz3": return "Blake2bWithEcdsa:Secp256r1";
      default: throw new Error(`Unexpected address prefix: ${prefix}`);
    }
  };

  getAuthMessage(message: string, address: string) : AuthMessage {  
    const nowMillis = Date.now();
    return {
      message,
      timestamp: nowMillis,
      msgToSign: message + nowMillis.toString(),
      algorithm: this.getTezosAlgorithm(address.slice(0, 3))
    };
  }

  /**
   * Get the tx data for Atomex Contract Initiate Swap call
   *
   * @param swapDetails details of the swap being initiated
   * @returns contract address and tx data that can be used to make a contract call
   */
  buildInitiateTransaction(initiateParameters: InitiateParameters) : PartialTransactionBody {
    if (initiateParameters.refundTimestamp < now())
      throw new Error(`Swap timestamp is in the past: ${initiateParameters.refundTimestamp}`);

    const parameter: string = this._entrypoints.get("initiate")?.Encode(
      initiateParameters.receivingAddress,
      initiateParameters.secretHash,
      initiateParameters.refundTimestamp,
      initiateParameters.rewardForRedeem,
    );
    return {
      data: {
        entrypoint: "initiate",
        value: parameter
      },
      contractAddr: this._contractAddress,
      amount: initiateParameters.netAmount + initiateParameters.rewardForRedeem
    };
  }

  /**
   * Get the tx data for Atomex Contract Redeem Swap call
   *
   * @param secret secret that can used to verify and redeem the funds
   * @returns contract address and tx data that can be used to make a contract call
   */
  buildRedeemTransaction(secret: string) : PartialTransactionBody {
    const parameter: string = this._entrypoints.get("redeem")?.Encode(secret);
    return {
      data: {
        entrypoint: "redeem",
        value: parameter
      },
      contractAddr: this._contractAddress,
    };
  }

  /**
   * Get the tx data for Atomex Contract Refund Swap call
   *
   * @param secretHash secretHash to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  buildRefundTransaction(secretHash: string) : PartialTransactionBody {
    const parameter: string = this._entrypoints.get("refund")?.Encode(secretHash);
    return {
      data: {
        entrypoint: "refund",
        value: parameter
      },
      contractAddr: this._contractAddress,
    };
  }

  /**
   * Get the tx data for Atomex Contract AdditionalFunds call
   *
   * @param secretHash secretHash to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  buildAddTransaction(secretHash: string, amount: number) : PartialTransactionBody {
    const parameter: string = this._entrypoints.get("add")?.Encode(secretHash);
    return {
      amount,
      data: {
        entrypoint: "add",
        value: parameter
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
  private getBlockDetails(block: BlockResponse) {
    let numEndorsements = 0;
    block.operations.forEach((ops) => {
      ops.forEach((op) => {
        op.contents.forEach((content) => {
          if (
            content.kind !== "endorsement" ||
            !Object.prototype.hasOwnProperty.call(content, "metadata")
          )
            return;
          const metadata = Object.getOwnPropertyDescriptor(content, "metadata")?.value;
          if (!Object.prototype.hasOwnProperty.call(metadata, "slots")) return;
          const slots = Object.getOwnPropertyDescriptor(metadata, "slots")?.value as number[];
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

  private parseInitiateParameters(content: OperationContentsAndResultTransaction) : InitiateParameters {
    if (content.parameters === undefined)
      throw new Error("Parameters are undefined");

    const params = this._entrypoints.get(content.parameters.entrypoint)?.Execute(content.parameters.value);
    if (params === undefined)
      throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);

    const initiateParams = (() => {
      switch (content.parameters.entrypoint) {
        case "initiate": return params;
        case "fund": return params["initiate"];
        case "default": return params["0"]["initiate"];
        default: throw new Error(`Unexpected entrypoint: ${content.parameters.entrypoint}`);
      }
    })()

    return {
      secretHash: initiateParams["settings"]["hashed_secret"],
      receivingAddress: initiateParams["participant"],
      refundTimestamp: dt2ts(initiateParams["settings"]["refund_time"]),
      netAmount: parseInt(content.amount) - parseInt(initiateParams["settings"]["payoff"]),
      rewardForRedeem: parseInt(initiateParams["settings"]["payoff"])
    }
  }

  private findContractCall(block: BlockResponse, txID: string) : OperationContentsAndResultTransaction {
    const opg = block.operations[3]?.find(opg => opg.hash == txID);
    if (opg === undefined)
      throw new Error(`Operation not found: ${txID} @ ${block.hash}`);

    const content = <OperationContentsAndResultTransaction> opg.contents.
      find(c => c.kind == "transaction" && c.destination == this._contractAddress);
    if (content === undefined)
      throw new Error(`Unsupported contract version is used`);

    return content as OperationContentsAndResultTransaction;
  }

  /**
   * Validate the Swap Details on chain using the tx detail from Atomex
   * [does not check tx status, use status provided by atomex]
   *
   * @param blockHeight block height of the block where the tx is present
   * @param txID operation/tx hash to identify blockchain transaction
   * @param expectedData expected swap details that will be used for validation
   * @param confirmations no. of tx confirmations required
   * @returns status of tx, current no. of confirms and est. next block generation timestamp.
   * No. of confirmations and block timestamp is only returned when `status:Included`
   */
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
        nextBlockETA: 0
      };
    }

    const headDetails = this.getBlockDetails(
      await this._tezos.rpc.getBlock({ block: 'head' })
    );
    const txBlockDetails = this.getBlockDetails(block);
    const confirmations = headDetails.level - txBlockDetails.level;

    let res : SwapTransactionStatus = {
      status: "Included",
      confirmations: confirmations,
      nextBlockETA: headDetails.timestamp + this._timeBetweenBlocks
    };

    if (confirmations >= minConfirmations 
      || headDetails.numEndorsements === 32 
      || txBlockDetails.numEndorsements === 32) {
      res.status = "Confirmed";
    }
    
    return res;
  }
}
