import elliptic from "elliptic";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import config from "../../config.json";
import { ExpectedSwapData, SwapDetails, SwapValidity } from "../../type/util";

/**
 * Ethereum Util class for Ethereum related Atomex helper functions
 */
export class EthereumUtil {
  private _rpc!: string;
  private _chainClient!: Web3;
  private _contract!: Contract;
  private _init: boolean;

  constructor() {
    this._init = false;
  }

  /**
   * Connects to the supported ethereum chain
   *
   * @param chain chains supported by atomex, can be either mainnet or testnet
   * @param rpc optional rpc endpoint to create eth chain client
   * @returns chain id of the connected chain
   */
  async connect(chain: "mainnet" | "testnet", rpc?: string) {
    const chainDetails = config.ethereum[chain];
    if (rpc !== undefined) {
      chainDetails.rpc = rpc;
    }
    const web3 = new Web3(chainDetails.rpc);
    const chainID = await web3.eth.getChainId();
    if (chainDetails.chainID !== chainID.toString()) {
      throw new Error(
        `Wrong RPC: Chain with Chain-ID ${chainID} Not Supported`,
      );
    }
    this._rpc = chainDetails.rpc;
    this._chainClient = web3;
    this._contract = new web3.eth.Contract(
      config.ethereum.abi as AbiItem[],
      chainDetails.contract,
    );
    this._init = true;
    return chainID;
  }

  /**
   * Checks if chain client has been initialized or not
   */
  private status() {
    if (!this._init)
      throw new Error("EthereumUtil was not setup properly, perform connect()");
  }

  /**
   * Get the tx data for Atomex Contract Initiate Swap call
   *
   * @param swapDetails details of the swap being initiated
   * @returns contract address and tx data that can be used to make a contract call
   */
  async initiate(swapDetails: SwapDetails) {
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
    const data: string = await this._contract.methods
      .initiate(
        swapDetails.hashedSecret,
        swapDetails.participant,
        swapDetails.refundTimestamp,
        swapDetails.countdown !== undefined
          ? swapDetails.countdown
          : swapDetails.refundTimestamp - 1,
        swapDetails.payoff,
        swapDetails.active !== undefined ? swapDetails.active : true,
      )
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  /**
   * Get the tx data for Atomex Contract Redeem Swap call
   *
   * @param secret secret that can used to verify and redeem the funds
   * @returns contract address and tx data that can be used to make a contract call
   */
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

  /**
   * Get the tx data for Atomex Contract Refund Swap call
   *
   * @param hashedSecret hashedSecret to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
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

  /**
   * Get the tx data for Atomex Contract AdditionalFunds call
   *
   * @param hashedSecret hashedSecret to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
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

  /**
   * Get the tx data for Atomex Contract Activate Swap call
   *
   * @param hashedSecret hashedSecret to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
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

  /**
   * Parse tx data for an Atomex Contract call
   *
   * @param txHash transaction hash to identify blockchain transaction
   * @returns the parameters and function name of the contract call
   */
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

  /**
   * Validate the Swap Details on chain using the tx detail from Atomex
   * [does not check tx status, use status provided by atomex]
   *
   * @param txHash transaction hash to identify blockchain transaction
   * @param expectedData expected swap details that will be used for validation
   * @param confirmations no. of tx confirmations required
   * @returns status of tx, current no. of confirms and est. next block generation timestamp.
   * No. of confirmations and block timestamp is only returned when `status:Included`
   */
  async validateSwapDetails(
    txHash: string,
    expectedData: ExpectedSwapData,
    confirmations = 5,
  ): Promise<SwapValidity> {
    this.status();
    const txData = await this.getTxData(txHash);
    if (
      txData === undefined ||
      txData.name !== "initiate" ||
      txData.to !== this._contract.options.address ||
      txData.amount !== expectedData._amount
    )
      return {
        status: "Invalid",
        confirmations: "",
        next_block_ts: "",
      };
    else {
      const keys = Object.keys(txData.parameters);
      for (let i = 0; i < keys.length; i++)
        if (
          Object.prototype.hasOwnProperty.call(expectedData, keys[i]) &&
          Object.getOwnPropertyDescriptor(
            expectedData,
            keys[i],
          )?.value.toString() !== txData.parameters[keys[i]]
        )
          return {
            status: "Invalid",
            confirmations: "",
            next_block_ts: "",
          };
    }

    const currentBlock = await this._chainClient.eth.getBlockNumber();
    const confirms = currentBlock - txData.blockHeight;
    if (confirms >= confirmations)
      return {
        status: "Confirmed",
        confirmations: "",
        next_block_ts: "",
      };

    const headData = await this._chainClient.eth.getBlock(currentBlock);
    const lastHeadData = await this._chainClient.eth.getBlock(currentBlock - 1);

    const next_block_ts =
      2 * Number(headData.timestamp) - Number(lastHeadData.timestamp);

    return {
      status: "Included",
      confirmations: confirms.toString(),
      next_block_ts: next_block_ts.toString(),
    };
  }

  private slice(i: number, j: number, bs: string) {
    return "0x" + bs.slice(i * 2 + 2, j * 2 + 2);
  }

  private length(sig: string) {
    return (sig.length - 2) / 2;
  }

  /**
   * Recover Ethereum Account Public Key from signature
   *
   * @param msg original message, `msgToSign` parameter generated using [[getAuthMessage]]
   * @param signature signed message
   * @returns ethereum public key
   */
  recoverPubKey(msg: string, signature: string) {
    this.status();
    const hash = this._chainClient.eth.accounts.hashMessage(msg);
    const vals = [
      this.slice(64, this.length(signature), signature),
      this.slice(0, 32, signature),
      this.slice(32, 64, signature),
    ];
    const vrs = {
      v: parseInt(vals[0].slice(2), 16),
      r: vals[1].slice(2),
      s: vals[2].slice(2),
    };
    const secp256k1 = new elliptic.ec("secp256k1");
    const ecPublicKey = secp256k1.recoverPubKey(
      Buffer.from(hash.slice(2), "hex"),
      vrs,
      vrs.v < 2 ? vrs.v : 1 - (vrs.v % 2),
    );
    return "0x" + ecPublicKey.encode("hex", false);
  }
}

/**
 * Singleton instance of EthereumUtil
 */
export const Ethereum = new EthereumUtil();
