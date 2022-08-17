/* eslint-disable @typescript-eslint/ban-types */
import BigNumber from 'bignumber.js';
import elliptic from 'elliptic';
import Web3 from 'web3';
import type { Transaction } from 'web3-core';
import type { Contract } from 'web3-eth-contract';
import type { AbiInput, AbiItem } from 'web3-utils';

import type { Atomex } from '../atomex';
import config from './config';
import { Helpers, now } from './helpers';
import type {
  AuthMessage,
  InitiateParameters,
  PartialTransactionBody,
  RedeemFees,
  SwapTransactionStatus,
} from './types';

export interface Function {
  types: AbiInput[];
  signature: string;
}

/**
 * Ethereum Util class for Ethereum related Atomex helper functions
 */
export class EthereumHelpers extends Helpers {
  private _web3: Web3;
  private _contract: Contract;
  private _timeBetweenBlocks: number;
  private _functions: Map<string, Function>;
  private _initiateGasLimitWithoutReward: number;
  private _initiateGasLimitWithReward: number;
  private _redeemGasLimit: number;

  constructor(
    atomex: Atomex,
    web3: Web3,
    jsonInterface: AbiItem[],
    contractAddress: string,
    timeBetweenBlocks: number,
    initiateGasLimitWithoutReward: number,
    initiateGasLimitWithReward: number,
    redeemGasLimit: number,
  ) {
    super(atomex);
    this._web3 = web3;
    this._contract = this.createContract(jsonInterface, contractAddress);
    this._timeBetweenBlocks = timeBetweenBlocks;
    this._initiateGasLimitWithoutReward = initiateGasLimitWithoutReward;
    this._initiateGasLimitWithReward = initiateGasLimitWithReward;
    this._redeemGasLimit = redeemGasLimit;
    this._functions = new Map<string, Function>();
    this.initializeFunctions(jsonInterface);
  }

  private initializeFunctions(jsonInterface: AbiItem[]) {
    jsonInterface.forEach(item => {
      if (item.type === 'function') {
        this._functions.set(item.name!, {
          types: item.inputs!,
          signature: this._web3.eth.abi.encodeFunctionSignature(item as AbiItem),
        });
      }
    });
  }

  /**
   * Connects to the supported ethereum chain
   *
   * @param newAtomex instance of new Atomex class
   * @param network networks supported by atomex, can be either mainnet or testnet
   * @param rpcUri optional rpc endpoint to create eth chain client
   * @returns chain id of the connected chain
   */
  static async create(
    newAtomex: Atomex,
    network: 'mainnet' | 'testnet',
    rpcUri?: string,
  ): Promise<EthereumHelpers> {
    const networkSettings = config.blockchains.ethereum.rpc[network];
    if (rpcUri !== undefined) {
      networkSettings.rpc = rpcUri;
    }

    const web3 = new Web3(networkSettings.rpc);
    const chainID = await web3.eth.getChainId();
    if (networkSettings.chainID !== chainID) {
      throw new Error(
        `Wrong chain ID: expected ${networkSettings.chainID}, actual ${chainID}`,
      );
    }

    return new EthereumHelpers(
      newAtomex,
      web3,
      config.currencies.ETH.contracts.abi as AbiItem[],
      config.currencies.ETH.contracts[network].address,
      networkSettings.blockTime,
      config.currencies.ETH.contracts[network].initiateGasLimitWithoutReward,
      config.currencies.ETH.contracts[network].initiateGasLimitWithReward,
      config.currencies.ETH.contracts[network].redeemGasLimit,
    );
  }

  getAuthMessage(message: string, _address?: string): AuthMessage {
    const nowMillis = Date.now();
    return {
      message,
      timestamp: nowMillis,
      msgToSign: message + nowMillis.toString(),
      algorithm: 'Keccak256WithEcdsa:Geth2940',
    };
  }

  buildInitiateTransaction(
    initiateParameters: InitiateParameters,
  ): PartialTransactionBody {
    if (initiateParameters.refundTimestamp < now()) {
      throw new Error(
        `Swap timestamp is in the past: ${initiateParameters.refundTimestamp}`,
      );
    }

    const data: string = this._contract.methods
      .initiate(
        '0x' + initiateParameters.secretHash,
        initiateParameters.receivingAddress,
        initiateParameters.refundTimestamp,
        initiateParameters.rewardForRedeem.toString(10),
      )
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
      amount: initiateParameters.netAmount.plus(initiateParameters.rewardForRedeem),
    };
  }

  buildRedeemTransaction(
    secret: string,
    hashedSecret: string,
  ): PartialTransactionBody {
    const data = this._contract.methods
      .redeem(hashedSecret, secret)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  buildRefundTransaction(secretHash: string): PartialTransactionBody {
    const data = this._contract.methods.refund(secretHash).encodeABI();
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
  buildActivateTransaction(secretHash: string): PartialTransactionBody {
    const data: string = this._contract.methods
      .activate(secretHash)
      .encodeABI();
    return {
      data,
      contractAddr: this._contract.options.address,
    };
  }

  parseInitiateParameters(transaction: Transaction): InitiateParameters {
    const initiateMethod = this._functions.get('initiate')!;

    if (!transaction.input.startsWith(initiateMethod.signature)) {
      throw new Error(`Unexpected method signature: ${transaction.input}`);
    }

    const params = this._web3.eth.abi.decodeParameters(
      initiateMethod.types,
      transaction.input.slice(initiateMethod.signature.length),
    );

    return {
      secretHash: params['_hashedSecret'].slice(2),
      receivingAddress: params['_participant'],
      refundTimestamp: parseInt(params['_refundTimestamp']),
      rewardForRedeem: new BigNumber(
        this._web3.utils.toBN(params['_payoff']).toString(),
      ),
      netAmount: new BigNumber(
        this._web3.utils
          .toBN(transaction.value)
          .sub(this._web3.utils.toBN(params['_payoff']))
          .toString(),
      ),
    };
  }

  async validateInitiateTransaction(
    _blockHeight: number,
    txId: string,
    secretHash: string,
    receivingAddress: string,
    amount: BigNumber | number,
    payoff: BigNumber | number,
    minRefundTimestamp: number,
    minConfirmations = 2,
  ): Promise<SwapTransactionStatus> {
    amount = new BigNumber(amount);
    payoff = new BigNumber(payoff);

    const netAmount = amount.minus(payoff);
    const transaction = await this.getTransaction(txId);

    try {
      if (!transaction)
        throw new Error(`Failed to retrieve transaction: ${txId}`);

      const errors: string[] = [];
      if (transaction.to?.toLowerCase() !== this._contract.options.address.toLowerCase())
        errors.push(`Wrong contract address: expect ${this._contract.options.address}, actual ${transaction.to}`);


      const initiateParameters = this.parseInitiateParameters(transaction);
      if (initiateParameters.secretHash !== secretHash)
        errors.push(`Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}`);

      if (initiateParameters.receivingAddress.toLowerCase() !== receivingAddress.toLowerCase())
        errors.push(`Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}`);

      if (!initiateParameters.netAmount.isEqualTo(netAmount))
        errors.push(`Net amount: expect ${netAmount.toString(10)}, actual ${initiateParameters.netAmount.toString(10)}`);

      if (initiateParameters.refundTimestamp < minRefundTimestamp)
        errors.push(`Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}`);

      if (errors.length) {
        const errorMessage = errors.reduce(
          (result, error, index) => `${result}\n\t${index + 1}. ${error};`,
          `Initiate transaction that satisfies the expected criteria is not found in ${txId} contents:`
        );
        throw new Error(errorMessage);
      }
    } catch (e: any) {
      return {
        status: 'Invalid',
        message: e.message,
        confirmations: 0,
        nextBlockETA: 0,
      };
    }

    const latestBlock = await this.getBlock('latest');
    const confirmations = latestBlock.number - (transaction.blockNumber || latestBlock.number);

    const res: SwapTransactionStatus = {
      status: transaction.blockNumber !== undefined ? 'Included' : 'Pending',
      confirmations,
      nextBlockETA: parseInt(latestBlock.timestamp.toString()) + this._timeBetweenBlocks,
    };

    if (confirmations >= minConfirmations) {
      res.status = 'Confirmed';
    }

    return res;
  }

  private hexSlice(i: number, j: number, bs: string) {
    return '0x' + bs.slice(i * 2 + 2, j * 2 + 2);
  }

  private getVRS(signature: string) {
    const vals = [
      this.hexSlice(64, (signature.length - 2) / 2, signature),
      this.hexSlice(0, 32, signature),
      this.hexSlice(32, 64, signature),
    ] as const;

    return {
      v: parseInt(vals[0].slice(2), 16),
      r: vals[1].slice(2),
      s: vals[2].slice(2),
    };
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
    const vrs = this.getVRS(signature);
    const secp256k1 = new elliptic.ec('secp256k1');
    const ecPublicKey = secp256k1.recoverPubKey(
      Buffer.from(hash.slice(2), 'hex'),
      vrs,
      vrs.v < 2 ? vrs.v : 1 - (vrs.v % 2),
    );
    return '0x' + ecPublicKey.encode('hex', false);
  }

  encodePublicKey(pubKey: string): string {
    if (pubKey.startsWith('0x')) {
      return pubKey.slice(2);
    }
    return pubKey;
  }

  encodeSignature(signature: string): string {
    const vrs = this.getVRS(signature);
    return vrs.r.padStart(64, '0') + vrs.s.padStart(64, '0');
  }

  async estimateInitiateFees(_source: string): Promise<number> {
    const gasPrice = await this._web3.eth.getGasPrice();
    const fee = parseInt(gasPrice) * this._initiateGasLimitWithReward * 1.2;

    return fee;
  }

  async estimateRedeemFees(_recipient: string): Promise<RedeemFees> {
    const gasPrice = await this._web3.eth.getGasPrice();
    const fee = parseInt(gasPrice) * this._redeemGasLimit;

    return {
      totalCost: fee,
      rewardForRedeem: 2 * fee,
    };
  }

  isValidAddress(address: string): boolean {
    return this._web3.utils.isAddress(address);
  }

  private getTransaction(txId: string) {
    return this._web3.eth.getTransaction(txId);
  }

  private getBlock(blockId: string | number) {
    return this._web3.eth.getBlock(blockId);
  }

  private createContract(jsonInterface: AbiItem[], contractAddress: string) {
    return new this._web3.eth.Contract(jsonInterface, contractAddress);
  }
}
