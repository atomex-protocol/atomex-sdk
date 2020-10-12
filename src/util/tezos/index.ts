import { ParameterSchema } from "@taquito/michelson-encoder";
import { TezosToolkit } from "@taquito/taquito";
import config from "../../config.json";
import { ExpectedSwapData, SwapDetails, SwapValidity } from "../../type/util";

/**
 * Tezos Util class for Tezos related Atomex helper functions
 */
export class TezosUtil {
  private _rpc!: string;
  private _chainClient!: TezosToolkit;
  private _contract!: ParameterSchema;
  private _init: boolean;
  private _contractAddr!: string;

  constructor() {
    this._init = false;
  }

  /**
   * Connects to the supported tezos chain
   *
   * @param chain chains supported by atomex, can be either mainnet or testnet
   * @param rpc optional rpc endpoint to create tezos chain client
   * @returns chain id of the connected chain
   */
  async connect(chain: "mainnet" | "testnet", rpc?: string) {
    const chainDetails = config.tezos[chain];
    if (rpc !== undefined) chainDetails.rpc = rpc;

    const tezos = new TezosToolkit();
    tezos.setProvider({ rpc });

    const chainID = await tezos.rpc.getChainId();

    if (chainDetails.chainID !== chainID.toString()) {
      throw new Error(`Wrong RPC: Chain wit Chain-ID ${chainID} Not Supported`);
    }

    this._rpc = chainDetails.rpc;
    this._chainClient = tezos;
    this._contract = new ParameterSchema(config.tezos.micheline);
    this._init = true;
    this._contractAddr = chainDetails.contract;

    return chainID;
  }

  /**
   * Checks if chain client has been initialized or not
   */
  private status() {
    if (!this._init)
      throw new Error("TezosUtil was not setup properly, perform connect()");
  }

  /**
   * Get the tx data for Atomex Contract Initiate Swap call
   *
   * @param swapDetails details of the swap being initiated
   * @returns contract address and tx data that can be used to make a contract call
   */
  initiate(swapDetails: SwapDetails) {
    this.status();
    if (
      !(
        swapDetails.refundTimestamp.toString().length == 10 &&
        Date.now() / 1000 < swapDetails.refundTimestamp
      )
    ) {
      throw new Error(
        "Invalid Refund Time, refund time should be in seconds and should be greater than the current time",
      );
    }
    const parameter: string = this._contract.Encode(
      "initiate",
      swapDetails.participant,
      swapDetails.hashedSecret,
      swapDetails.refundTimestamp,
      swapDetails.payoff,
    );
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  /**
   * Get the tx data for Atomex Contract Redeem Swap call
   *
   * @param secret secret that can used to verify and redeem the funds
   * @returns contract address and tx data that can be used to make a contract call
   */
  redeem(secret: string) {
    this.status();
    const parameter: string = this._contract.Encode("redeem", secret);
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  /**
   * Get the tx data for Atomex Contract Refund Swap call
   *
   * @param hashedSecret hashedSecret to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  refund(hashedSecret: string) {
    this.status();
    const parameter: string = this._contract.Encode("refund", hashedSecret);
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  /**
   * Get the tx data for Atomex Contract AdditionalFunds call
   *
   * @param hashedSecret hashedSecret to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  add(hashedSecret: string) {
    this.status();
    const parameter: string = this._contract.Encode("add", hashedSecret);
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  /**
   * Get Block endorsements and level
   *
   * @param blockLevel block level to identify the block
   * @returns endorsements , level of the block and block generation time
   */
  private async getBlockDetails(blockLevel: "head" | number) {
    const block = await this._chainClient.rpc.getBlock({
      block: blockLevel.toString(),
    });
    let endorsementCount = 0;
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
          endorsementCount += slots.length;
        });
      });
    });
    return {
      endorsements: endorsementCount,
      level: block.metadata.level.level,
      time: new Date(block.header.timestamp).getTime() / 1000,
    };
  }

  /**
   * Get the Swap Initiate parameters from a tx
   *
   * @param blockHeight block height of the block where the tx is present
   * @param txID operation/tx hash of the contract call
   * @param hashedSecret hashedSecret to identify swap
   */
  private async getSwapParams(
    blockHeight: number,
    txID: string,
    hashedSecret: string,
  ) {
    const block = await this._chainClient.rpc.getBlock({
      block: blockHeight.toString(),
    });
    let data = {};
    try {
      block.operations.forEach((ops) => {
        ops.forEach((op) => {
          if (op.hash === txID) {
            op.contents.forEach((content) => {
              if (content.kind !== "transaction") return;
              if (
                content.destination !== this._contractAddr ||
                content.parameters === undefined
              )
                return;
              const params = this._contract.Execute(content.parameters.value);
              if (
                params["0"] === undefined ||
                params["0"]["initiate"] === undefined ||
                params["0"]["initiate"]["settings"]["hashed_secret"] !==
                  hashedSecret
              )
                return;
              params["0"]["initiate"]["settings"]["refund_time"] = parseInt(
                (
                  new Date(
                    params["0"]["initiate"]["settings"]["refund_time"],
                  ).getTime() / 1000
                ).toFixed(0),
              );
              data = params["0"]["initiate"];
              data = { ...data, amount: content.amount };
              throw "BreakException";
            });
            throw "BreakException";
          }
        });
      });
    } catch (e) {
      if (e !== "BreakException") throw e;
      if (Object.keys(data).length === 0) return undefined;
      return data;
    }
    return undefined;
  }

  /**
   * Validate the Swap Details on chain using the tx detail from Atomex
   *
   * @param blockHeight block height of the block where the tx is present
   * @param txID operation/tx hash to identify blockchain transaction
   * @param expectedData expected swap details that will be used for validation
   * @param confirmations no. of tx confirmations required
   * @returns status of tx, current no. of confirms and est. next block generation timestamp.
   * No. of confirmations and block timestamp is only returned when `status:Included`
   */
  async validateSwapTransaction(
    blockHeight: number,
    txID: string,
    expectedData: ExpectedSwapData,
    confirmations = 5,
  ): Promise<SwapValidity> {
    const swapData = (await this.getSwapParams(
      blockHeight,
      txID,
      expectedData._hashedSecret,
    )) as Record<string, any>;

    if (swapData === undefined)
      return {
        status: "Invalid",
        confirmations: "",
        next_block_ts: "",
      };

    swapData["settings"]["payoff"] = swapData["settings"]["payoff"].toString();
    const amount = (
      Number(swapData["amount"]) - Number(swapData["settings"]["payoff"])
    ).toString();

    if (
      swapData["participant"] !== expectedData._participant ||
      swapData["settings"]["refund_time"] !== expectedData._refundTimestamp ||
      swapData["settings"]["payoff"] !== expectedData._payoff ||
      amount !== expectedData._amount
    )
      return {
        status: "Invalid",
        confirmations: "",
        next_block_ts: "",
      };

    const headDetails = await this.getBlockDetails("head");
    const txBlockDetails = await this.getBlockDetails(blockHeight);
    const confirms = headDetails.level - txBlockDetails.level;
    if (
      confirms >= confirmations ||
      headDetails.endorsements === 32 ||
      txBlockDetails.endorsements === 32
    )
      return {
        status: "Confirmed",
        confirmations: "",
        next_block_ts: "",
      };
    const lasHeadDetails = await this.getBlockDetails(headDetails.level - 1);
    const next_block_ts = 2 * headDetails.time - lasHeadDetails.time;
    return {
      status: "Included",
      confirmations: confirms.toString(),
      next_block_ts: next_block_ts.toString(),
    };
  }
}

/**
 * Singleton instance of TezosUtil
 */
export const Tezos = new TezosUtil();
