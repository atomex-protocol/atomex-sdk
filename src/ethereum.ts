import elliptic from "elliptic";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiInput, AbiItem } from "web3-utils";
import { Transaction } from "web3-core";
import { InitiateParameters, PartialTransactionBody, SwapTransactionStatus, AuthMessage } from "./types";
import { Helpers, now } from "./helpers";
import config from "./config.json";

export interface ContractMethod {
  types: AbiInput[];
  signature: string;
}

/**
 * Ethereum Util class for Ethereum related Atomex helper functions
 */
export class EthereumHelpers implements Helpers {
  private _web3: Web3;
  private _contract: Contract;
  private _methods: Map<string, ContractMethod>;
  private _timeBetweenBlocks: number;

  constructor(
    web3: Web3,
    contract: Contract,
    methods: Map<string, ContractMethod>,
    timeBetweenBlocks: number) {
    this._web3 = web3;
    this._contract = contract;
    this._methods = methods;
    this._timeBetweenBlocks = timeBetweenBlocks;
  }

  /**
   * Connects to the supported ethereum chain
   *
   * @param chain chains supported by atomex, can be either mainnet or testnet
   * @param rpc optional rpc endpoint to create eth chain client
   * @returns chain id of the connected chain
   */
  static async create(network: "mainnet" | "testnet", rpcUri?: string) : Promise<EthereumHelpers> {
    const networkSettings = config.rpc.ethereum[network];
    if (rpcUri !== undefined)
      networkSettings.rpc = rpcUri;

    const web3 = new Web3(networkSettings.rpc);
    const chainID = await web3.eth.getChainId();
    if (networkSettings.chainID !== chainID.toString())
      throw new Error(`Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`);

    let methods = new Map<string, ContractMethod>();
    config.contracts.ETH.abi.forEach(item => {
      if (item.type === "function")
        methods.set(item.name, { 
          types: item.inputs,
          signature: web3.eth.abi.encodeFunctionSignature(item as AbiItem)
        });
    })

    const contract = new web3.eth.Contract(
      config.contracts.ETH.abi as AbiItem[],
      config.contracts.ETH[network],
    );
    
    return new EthereumHelpers(
      web3,
      contract,
      methods,
      networkSettings.blockTime
    );
  }

  /**
   * Get the details needed for `getAuthToken` request
   *
   * @remarks the `msgToSign` value needs to be signed before being used for Auth
   * @param message message to include for the Atomex Authentication message
   * @returns details required for Atomex Auth
   */
  getAuthMessage(message: string, address?: string) : AuthMessage {
    const nowMillis = Date.now();
    return {
      message,
      timestamp: nowMillis,
      msgToSign: message + nowMillis.toString(),
      algorithm: "Keccak256WithEcdsa:Geth2940"
    };
  };

  /**
   * Get the tx data for Atomex Contract Initiate Swap call
   *
   * @param swapDetails details of the swap being initiated
   * @returns contract address and tx data that can be used to make a contract call
   */
  buildInitiateTransaction(initiateParameters: InitiateParameters) : PartialTransactionBody {
    if (initiateParameters.refundTimestamp < now())
      throw new Error(`Swap timestamp is in the past: ${initiateParameters.refundTimestamp}`);

    const data: string = this._contract.methods
      .initiate(
        initiateParameters.secretHash,
        initiateParameters.receivingAddress,
        initiateParameters.refundTimestamp,
        initiateParameters.countdown !== undefined
          ? initiateParameters.countdown
          : initiateParameters.refundTimestamp - 1,
        initiateParameters.rewardForRedeem,
        initiateParameters.active !== undefined 
          ? initiateParameters.active 
          : true,
      )
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
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
    const data: string = this._contract.methods
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
  buildRefundTransaction(secretHash: string) : PartialTransactionBody {
    const data: string = this._contract.methods
      .refund(secretHash)
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
  buildAddTransaction(secretHash: string, amount: number) : PartialTransactionBody {
    const data: string = this._contract.methods
      .add(secretHash)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
      amount
    };
  }

  /**
   * Get the tx data for Atomex Contract Activate Swap call
   *
   * @param hashedSecret hashedSecret to identify swap
   * @returns contract address and tx data that can be used to make a contract call
   */
  buildActivateTransaction(secretHash: string) {
    const data: string = this._contract.methods
      .activate(secretHash)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  private parseInitiateParameters(transaction: Transaction) : InitiateParameters {
    const initiateMethod = this._methods.get("initiate")!;

    if (!transaction.input.startsWith(initiateMethod.signature))
      throw new Error(`Unexpected method signature: ${transaction.input}`);

    const params = this._web3.eth.abi.decodeParameters(
      initiateMethod.types, 
      transaction.input.slice(initiateMethod.signature.length)
    );

    return {
      secretHash: params["_hashedSecret"],
      receivingAddress: params["_participant"],
      refundTimestamp: params["_refundTimestamp"],
      rewardForRedeem: params["_payoff"],
      netAmount: this._web3.utils
        .toBN(transaction.value)
        .sub(this._web3.utils.toBN(params["_payoff"]))
        .toNumber()
    }
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
  async validateInitiateTransaction(
    blockHeight: number,
    txID: string,
    secretHash: string,
    receivingAddress: string,
    netAmount: number,
    minRefundTimestamp: number,
    minConfirmations: number): Promise<SwapTransactionStatus> {
    const transaction = await this._web3.eth.getTransaction(txID);

    try {
      if (transaction === undefined)
        throw new Error(`Failed to retrieve transaction: ${txID}`);

      if (transaction.to !== this._contract.options.address)
        throw new Error(`Wrong contract address: ${transaction.to}`);

      const initiateParameters = this.parseInitiateParameters(transaction);
      if (initiateParameters.secretHash !== secretHash)
        throw new Error(`Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}`);

      if (initiateParameters.receivingAddress !== receivingAddress)
        throw new Error(`Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}`);

      if (initiateParameters.netAmount !== netAmount)
        throw new Error(`Net amount: expect ${netAmount}, actual ${initiateParameters.netAmount}`);

      if (initiateParameters.refundTimestamp < minRefundTimestamp)
        throw new Error(`Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}`);
    } catch(e) {
      return {
        status: "Invalid",
        message: e.message,
        confirmations: 0,
        nextBlockETA: 0
      };
    }

    const latestBlock = await this._web3.eth.getBlock("latest");
    const confirmations = latestBlock.number - (transaction.blockNumber || latestBlock.number);

    let res : SwapTransactionStatus = {
      status: transaction.blockNumber !== undefined ? "Included" : "Pending",
      confirmations: confirmations,
      nextBlockETA: parseInt(latestBlock.timestamp.toString()) + this._timeBetweenBlocks
    };

    if (confirmations >= minConfirmations)
      res.status = "Confirmed";

    return res;
  }

  private hexSlice(i: number, j: number, bs: string) {
    return "0x" + bs.slice(i * 2 + 2, j * 2 + 2);
  }

  /**
   * Recover Ethereum Account Public Key from RLC signature
   *
   * @param msg original message, `msgToSign` parameter generated using [[getAuthMessage]]
   * @param signature signed message
   * @returns ethereum public key
   */
  recoverPublicKey(msg: string, signature: string) {
    const hash = this._web3.eth.accounts.hashMessage(msg);
    const vals = [
      this.hexSlice(64, (signature.length - 2) / 2, signature),
      this.hexSlice(0, 32, signature),
      this.hexSlice(32, 64, signature),
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
