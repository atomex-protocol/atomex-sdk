import { ParameterSchema } from "@taquito/michelson-encoder";
import { TezosToolkit } from "@taquito/taquito";
import config from "../../config.json";
import { ExpectedSwapData, SwapDetails } from "../../type/util";

export class TezosUtil {
  private _rpc!: string;
  private _chainClient!: TezosToolkit;
  private _contract!: ParameterSchema;
  private _init: boolean;
  private _contractAddr!: string;

  constructor() {
    this._init = false;
  }

  async connect(rpc: string) {
    const tezos = new TezosToolkit();
    tezos.setProvider({ rpc });
    const chainID = await tezos.rpc.getChainId();
    const conf = config.tezos;
    if (
      !Object.prototype.hasOwnProperty.call(conf.chains, chainID.toString())
    ) {
      throw new Error(`Chain wit Chain-ID ${chainID} Not Supported`);
    }
    this._rpc = rpc;
    this._chainClient = tezos;
    this._contract = new ParameterSchema(config.tezos.micheline);
    this._init = true;
    this._contractAddr = Object.getOwnPropertyDescriptor(
      conf.chains,
      chainID.toString(),
    )?.value.contract;
    return chainID;
  }

  private status() {
    if (!this._init) throw new Error("TezosUtil was not setup properly");
  }

  initiate({
    hashedSecret,
    participant,
    refundTimestamp,
    payoff,
  }: SwapDetails) {
    this.status();
    if (
      !(
        refundTimestamp.toString().length == 10 &&
        Date.now() / 1000 < refundTimestamp
      )
    ) {
      throw new Error(
        "Invalid Refund Time, refund time should be in seconds and should be greater than the current time",
      );
    }
    const parameter: string = this._contract.Encode(
      "initiate",
      participant,
      hashedSecret,
      refundTimestamp,
      payoff,
    );
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  redeem(secret: string) {
    this.status();
    const parameter: string = this._contract.Encode("redeem", secret);
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  refund(hashedSecret: string) {
    this.status();
    const parameter: string = this._contract.Encode("refund", hashedSecret);
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  add(hashedSecret: string) {
    this.status();
    const parameter: string = this._contract.Encode("add", hashedSecret);
    return {
      parameter,
      contractAddr: this._contractAddr,
    };
  }

  async getCurrentHeadDetails(blockLevel: "head" | number) {
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
    };
  }

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
  }

  async validateSwapTransaction(
    blockHeight: number,
    txID: string,
    expectedData: ExpectedSwapData,
    confirmations = 5,
  ) {
    const swapData = (await this.getSwapParams(
      blockHeight,
      txID,
      expectedData._hashedSecret,
    )) as Record<string, any>;

    if (swapData === undefined) return false;

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
      return false;

    const headDetails = await this.getCurrentHeadDetails("head");
    const txBlockDetails = await this.getCurrentHeadDetails(blockHeight);

    if (
      headDetails.level - txBlockDetails.level < confirmations &&
      headDetails.endorsements !== 32 &&
      txBlockDetails.endorsements !== 32
    )
      return false;

    return true;
  }
}

export const Tezos = new TezosUtil();
