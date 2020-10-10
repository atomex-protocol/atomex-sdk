import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import config from "../../config.json";
import { ExpectedSwapData, SwapDetails } from "../../type/util";

export class EthereumUtil {
  private _rpc!: string;
  public _chainClient!: Web3;
  public _contract!: Contract;
  private _init: boolean;

  constructor() {
    this._init = false;
  }

  async connect(rpc: string) {
    const web3 = new Web3(rpc);
    const chainID = await web3.eth.getChainId();
    const conf = config.ethereum;
    if (
      !Object.prototype.hasOwnProperty.call(conf.chains, chainID.toString())
    ) {
      throw new Error(`Chain wit Chain-ID ${chainID} Not Supported`);
    }
    this._rpc = rpc;
    this._chainClient = web3;
    this._contract = new web3.eth.Contract(
      config.ethereum.abi as AbiItem[],
      Object.getOwnPropertyDescriptor(
        conf.chains,
        chainID.toString(),
      )?.value.contract,
    );
    this._init = true;
    return chainID;
  }

  private status() {
    if (!this._init) throw new Error("EthereumUtil was not setup properly");
  }

  async initiate({
    hashedSecret,
    participant,
    refundTimestamp,
    payoff,
    active,
    countdown,
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
    const data: string = await this._contract.methods
      .initiate(
        hashedSecret,
        participant,
        refundTimestamp,
        countdown !== undefined ? countdown : refundTimestamp - 1,
        payoff,
        active !== undefined ? active : true,
      )
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  async redeem(secret: string) {
    this.status();
    const data: string = await this._contract.methods
      .redeem(secret)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  async refund(hashedSecret: string) {
    this.status();
    const data: string = await this._contract.methods
      .refund(hashedSecret)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  async add(hashedSecret: string) {
    this.status();
    const data: string = await this._contract.methods
      .add(hashedSecret)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  async activate(hashedSecret: string) {
    this.status();
    const data: string = await this._contract.methods
      .activate(hashedSecret)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  private async getTxData(txHash: string) {
    const txData = await this._chainClient.eth.getTransaction(txHash);

    if (txData.blockNumber === null) return undefined;

    const { input, value, blockNumber, to } = txData;
    const returnData = {
      to,
      amount: "",
      blockHeight: blockNumber,
      name: "",
      parameters: {} as Record<string, string>,
    };

    for (const object of config.ethereum.abi as AbiItem[]) {
      if (object.type !== "function") continue;

      const signature = this._chainClient.eth.abi.encodeFunctionSignature(
        object,
      );

      if (input.startsWith(signature)) {
        const args = this._chainClient.eth.abi.decodeParameters(
          object.inputs || [],
          input.slice(signature.length),
        );

        if (object.inputs === undefined) continue;
        returnData.name = object.name || "";

        for (let i = 0; i < args.__length__; i++)
          returnData.parameters = {
            ...returnData.parameters,
            [object.inputs[i].name]: args[i],
          };

        returnData.amount = this._chainClient.utils
          .toBN(value)
          .sub(this._chainClient.utils.toBN(returnData.parameters["_payoff"]))
          .toString();
        break;
      }
    }

    return returnData;
  }

  async validateSwapTransaction(
    txHash: string,
    expectedData: ExpectedSwapData,
    confirmations = 5,
  ) {
    const txData = await this.getTxData(txHash);
    if (
      txData === undefined ||
      txData.name !== "initiate" ||
      txData.to !== this._contract.options.address
    )
      return false;

    const currentBlock = await this._chainClient.eth.getBlockNumber();

    if (
      currentBlock - txData.blockHeight < confirmations ||
      txData.amount !== expectedData._amount
    )
      return false;

    const keys = Object.keys(txData.parameters);
    for (let i = 0; i < keys.length; i++)
      if (
        Object.prototype.hasOwnProperty.call(expectedData, keys[i]) &&
        Object.getOwnPropertyDescriptor(
          expectedData,
          keys[i],
        )?.value.toString() !== txData.parameters[keys[i]]
      )
        return false;
    return true;
  }
}

export const Ethereum = new EthereumUtil();
