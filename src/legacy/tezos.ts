import { ParameterSchema } from '@taquito/michelson-encoder';
import {
  BlockResponse,
  OperationContentsAndResultTransaction,
  OpKind,
} from '@taquito/rpc';
import { TezosToolkit } from '@taquito/taquito';
import {
  b58cdecode,
  prefix,
  validateAddress,
  ValidationResult,
} from '@taquito/utils';
import BigNumber from 'bignumber.js';

import type { Atomex } from '../atomex';
import config from './config';
import { dt2ts, Helpers, now } from './helpers';
import type {
  Algorithm,
  AuthMessage,
  InitiateParameters,
  PartialTransactionBody,
  RedeemFees,
  SwapTransactionStatus,
  TezosBasedCurrency,
  Network
} from './types';

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toISOString().slice(0, -5) + 'Z';
};

/**
 * Tezos Util class for Tezos related Atomex helper functions
 */
export class TezosHelpers extends Helpers {
  protected _tezos: TezosToolkit;
  protected _contractAddress: string;
  protected _timeBetweenBlocks: number;
  protected _entrypoints: Map<string, ParameterSchema>;
  protected _gasLimit: number;
  protected _minimalFees: number;
  protected _minimalNanotezPerGasUnit: number;
  protected _minimalNanotezPerByte: number;
  protected _costPerByte: number;
  protected _redeemTxSize: number;
  protected _initiateTxSize: number;

  constructor(
    atomex: Atomex,
    tezos: TezosToolkit,
    entrypoints: Record<string, any>,
    contractAddress: string,
    timeBetweenBlocks: number,
    gasLimit: number,
    minimalFees: number,
    minimalNanotezPerGasUnit: number,
    minimalNanotezPerByte: number,
    costPerByte: number,
    redeemTxSize: number,
    initiateTxSize: number,
  ) {
    super(atomex);
    this._tezos = tezos;
    this._contractAddress = contractAddress;
    this._timeBetweenBlocks = timeBetweenBlocks;
    this._gasLimit = gasLimit;
    this._minimalFees = minimalFees;
    this._minimalNanotezPerGasUnit = minimalNanotezPerGasUnit;
    this._minimalNanotezPerByte = minimalNanotezPerByte;
    this._costPerByte = costPerByte;
    this._redeemTxSize = redeemTxSize;
    this._initiateTxSize = initiateTxSize;
    this._entrypoints = new Map<string, ParameterSchema>(
      Object.entries(entrypoints).map(([name, typeExpr]) => {
        return [name, new ParameterSchema(typeExpr)];
      }),
    );
  }

  /**
   * Connects to the supported tezos chain
   *
   * @param newAtomex instance of new Atomex class
   * @param network networks supported by atomex, can be either mainnet or testnet
   * @param currency either native currency (XTZ) or any supported FA1.2/FA2 token symbol
   * @param rpcUri optional rpc endpoint to create tezos chain client
   * @returns chain id of the connected chain
   */
  static async create(
    newAtomex: Atomex,
    network: Network,
    currency: TezosBasedCurrency = 'XTZ',
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

    return new TezosHelpers(
      newAtomex,
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

  private getTezosAlgorithm(prefix?: string): Algorithm {
    switch (prefix) {
      case 'tz1':
        return 'Ed25519:Blake2b';
      case 'tz2':
        return 'Blake2bWithEcdsa:Secp256k1';
      case 'tz3':
        return 'Blake2bWithEcdsa:Secp256r1';
      default:
        throw new Error(`Unexpected address prefix: ${prefix}`);
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

  buildInitiateTransaction(
    initiateParameters: InitiateParameters,
  ): PartialTransactionBody {
    if (initiateParameters.refundTimestamp < now()) {
      throw new Error(
        `Swap timestamp is in the past: ${initiateParameters.refundTimestamp}`,
      );
    }

    const parameter = this._entrypoints
      .get('initiate')
      ?.Encode(
        initiateParameters.receivingAddress,
        initiateParameters.secretHash,
        formatTimestamp(initiateParameters.refundTimestamp),
        initiateParameters.rewardForRedeem,
      );
    return {
      data: {
        entrypoint: 'initiate',
        value: parameter,
      },
      contractAddr: this._contractAddress,
      amount: initiateParameters.netAmount.plus(initiateParameters.rewardForRedeem),
    };
  }

  buildRedeemTransaction(
    secret: string,
    _hashedSecret = '',
  ): PartialTransactionBody {
    return {
      data: {
        entrypoint: 'redeem',
        value: this._entrypoints.get('redeem')?.Encode(secret),
      },
      contractAddr: this._contractAddress,
    };
  }

  buildRefundTransaction(secretHash: string): PartialTransactionBody {
    return {
      data: {
        entrypoint: 'refund',
        value: this._entrypoints.get('refund')?.Encode(secretHash),
      },
      contractAddr: this._contractAddress,
    };
  }

  /**
   * Get Block level
   *
   * @param blockLevel block level to identify the block
   * @returns level of the block and block generation time
   */
  getBlockDetails(block: BlockResponse) {
    return {
      level: block.metadata.level_info!.level,
      timestamp: dt2ts(block.header.timestamp),
    };
  }

  parseInitiateParameters(
    content: OperationContentsAndResultTransaction,
  ): InitiateParameters {
    if (content.parameters === undefined) {
      throw new Error('Parameters are undefined');
    }

    const params = this._entrypoints
      .get(content.parameters.entrypoint)
      ?.Execute(content.parameters.value);
    if (params === undefined) {
      throw new Error(
        `Unexpected entrypoint: ${content.parameters.entrypoint}`,
      );
    }

    const initiateParams = (() => {
      switch (content.parameters.entrypoint) {
        case 'initiate':
          return params;
        case 'fund':
        case 'default':
          return params['initiate'];
        default:
          throw new Error(
            `Unexpected entrypoint: ${content.parameters.entrypoint}`,
          );
      }
    })();

    return {
      secretHash: initiateParams['settings']['hashed_secret'],
      receivingAddress: initiateParams['participant'],
      refundTimestamp: dt2ts(initiateParams['settings']['refund_time']),
      netAmount: new BigNumber(content.amount).minus(initiateParams['settings']['payoff']),
      rewardForRedeem: new BigNumber(initiateParams['settings']['payoff']),
    };
  }

  findContractCall(
    block: BlockResponse,
    txID: string,
  ): OperationContentsAndResultTransaction[] {
    const opg = block.operations[3]?.find(opg => opg.hash == txID);
    if (opg === undefined) {
      throw new Error(`Operation not found: ${txID} @ ${block.hash}`);
    }

    const contents = (
      opg.contents.filter(c => c.kind == 'transaction' && c.destination == this._contractAddress)
    ) as OperationContentsAndResultTransaction[];
    if (contents.length === 0) {
      throw new Error('Unsupported contract version is used');
    }

    return contents;
  }

  async validateInitiateTransaction(
    blockHeight: number,
    txID: string,
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
    const block = await this.getBlock(blockHeight);

    try {
      let errors: string[] = [];
      const tx = this.findContractCall(block, txID).find(content => {
        errors = [];

        const initiateParameters = this.parseInitiateParameters(content);
        if (initiateParameters.secretHash !== secretHash)
          errors.push(`Secret hash: expect ${secretHash}, actual ${initiateParameters.secretHash}. Counter = ${content.counter}`);

        if (initiateParameters.receivingAddress.toLowerCase() !== receivingAddress.toLowerCase())
          errors.push(`Receiving address: expect ${receivingAddress}, actual ${initiateParameters.receivingAddress}. Counter = ${content.counter}`);

        if (!initiateParameters.netAmount.isEqualTo(netAmount))
          errors.push(`Net amount: expect ${netAmount.toString(10)}, actual ${initiateParameters.netAmount.toString(10)}. Counter = ${content.counter}`);

        if (initiateParameters.refundTimestamp < minRefundTimestamp)
          errors.push(`Refund timestamp: minimum ${minRefundTimestamp}, actual ${initiateParameters.refundTimestamp}. Counter = ${content.counter}`);

        return !errors.length;
      }, this);

      if (!tx) {
        const errorMessage = errors.reduce(
          (result, error, index) => `${result}\n\t${index + 1}. ${error};`,
          `Initiate transaction that satisfies the expected criteria is not found in ${txID} contents:`
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

    const headDetails = this.getBlockDetails(
      await this.getBlock('head')
    );
    const txBlockDetails = this.getBlockDetails(block);
    const confirmations = headDetails.level! - txBlockDetails.level!;

    const res: SwapTransactionStatus = {
      status: 'Included',
      confirmations,
      nextBlockETA: headDetails.timestamp + this._timeBetweenBlocks,
    };

    if (confirmations >= minConfirmations) {
      res.status = 'Confirmed';
    }

    return res;
  }

  encodePublicKey(pubKey: string): string {
    const curve = pubKey.substring(0, 2);
    switch (curve) {
      case 'ed':
        return Buffer.from(b58cdecode(pubKey, prefix['edpk'])).toString('hex');
      case 'p2':
        return Buffer.from(b58cdecode(pubKey, prefix['p2pk'])).toString('hex');
      case 'sp':
        return Buffer.from(b58cdecode(pubKey, prefix['sppk'])).toString('hex');
      default:
        throw new Error('Unsupported Public Key Type');
    }
  }

  encodeSignature(signature: string): string {
    const pref = signature.startsWith('sig')
      ? signature.substring(0, 3)
      : signature.substring(0, 5);
    if (Object.prototype.hasOwnProperty.call(prefix, pref)) {
      return Buffer.from(
        b58cdecode(
          signature,
          Object.getOwnPropertyDescriptor(prefix, pref)?.value,
        ),
      ).toString('hex');
    }
    throw new Error('Unsupported Signature Type');
  }

  calcFees(gas = 0, storageDiff = 0, txSize = 0): number {
    return (
      this._minimalFees +
      this._minimalNanotezPerGasUnit * gas +
      this._minimalNanotezPerByte * txSize +
      storageDiff * this._costPerByte
    );
  }

  async estimateInitiateFees(source: string): Promise<number> {
    const dummyTx = {
      receivingAddress: 'tz1Q2prWCrDGFDuGTe7axdt4z9e3QkCqdhmD',
      secretHash:
        '169cbd29345af89a0983f28254e71bdd1367890b9876fc8a9ea117c32f6a521b',
      refundTimestamp: 2147483647,
      rewardForRedeem: new BigNumber(0),
      netAmount: new BigNumber(100),
    };

    const tx = this.buildInitiateTransaction(dummyTx);

    const header = await this._tezos.rpc.getBlockHeader();
    const contract = await this._tezos.rpc.getContract(source);
    const op = await this._tezos.rpc.runOperation({
      chain_id: header.chain_id,
      operation: {
        branch: header.hash,
        signature:
          'sigUHx32f9wesZ1n2BWpixXz4AQaZggEtchaQNHYGRCoWNAXx45WGW2ua3apUUUAGMLPwAU41QoaFCzVSL61VaessLg4YbbP',
        contents: [
          {
            amount: '0',
            counter: (parseInt(contract.counter || '0') + 1).toString(),
            destination: this._contractAddress,
            fee: this.calcFees(1040000, 60000, this._initiateTxSize).toString(),
            gas_limit: '1040000', // TODO: move to config
            kind: OpKind.TRANSACTION,
            source,
            storage_limit: '60000', // TODO: move to config
            parameters: tx.data,
          },
        ],
      },
    });

    let paidStorageDiff = 0,
      consumedGas = 0;
    (op.contents as OperationContentsAndResultTransaction[]).forEach(tx => {
      if (tx.metadata.operation_result.status !== 'applied') {
        throw new Error('Some error was encountered while estimating fees');
      }
      consumedGas += parseInt(tx.metadata.operation_result.consumed_gas || '0');
      paidStorageDiff += parseInt(
        tx.metadata.operation_result.paid_storage_size_diff || '0',
      );
    });

    return this.calcFees(consumedGas, paidStorageDiff, this._initiateTxSize);
  }

  async estimateRedeemFees(recipient: string): Promise<RedeemFees> {
    let fees = this.calcFees(this._gasLimit, 0, this._redeemTxSize);
    const revealedKey = await this._tezos.rpc.getManagerKey(recipient);
    if (revealedKey === null) {
      fees += 257 * this._costPerByte;
    }
    return {
      totalCost: fees,
      rewardForRedeem: 2 * fees,
    };
  }

  isValidAddress(address: string): boolean {
    return validateAddress(address) == ValidationResult.VALID;
  }

  private getBlock(blockId: string | number) {
    return this._tezos.rpc.getBlock({ block: blockId.toString() });
  }
}
