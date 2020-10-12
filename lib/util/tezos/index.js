"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tezos = exports.TezosUtil = void 0;
var michelson_encoder_1 = require("@taquito/michelson-encoder");
var taquito_1 = require("@taquito/taquito");
var config_json_1 = __importDefault(require("../../config.json"));
/**
 * Tezos Util class for Tezos related Atomex helper functions
 */
var TezosUtil = /** @class */ (function () {
    function TezosUtil() {
        this._init = false;
    }
    /**
     * Connects to the supported tezos chain
     *
     * @param chain chains supported by atomex, can be either mainnet or testnet
     * @param rpc optional rpc endpoint to create tezos chain client
     * @returns chain id of the connected chain
     */
    TezosUtil.prototype.connect = function (chain, rpc) {
        return __awaiter(this, void 0, void 0, function () {
            var chainDetails, tezos, chainID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chainDetails = config_json_1.default.tezos[chain];
                        if (rpc !== undefined)
                            chainDetails.rpc = rpc;
                        tezos = new taquito_1.TezosToolkit();
                        tezos.setProvider({ rpc: rpc });
                        return [4 /*yield*/, tezos.rpc.getChainId()];
                    case 1:
                        chainID = _a.sent();
                        if (chainDetails.chainID !== chainID.toString()) {
                            throw new Error("Wrong RPC: Chain wit Chain-ID " + chainID + " Not Supported");
                        }
                        this._rpc = chainDetails.rpc;
                        this._chainClient = tezos;
                        this._contract = new michelson_encoder_1.ParameterSchema(config_json_1.default.tezos.micheline);
                        this._init = true;
                        this._contractAddr = chainDetails.contract;
                        return [2 /*return*/, chainID];
                }
            });
        });
    };
    /**
     * Checks if chain client has been initialized or not
     */
    TezosUtil.prototype.status = function () {
        if (!this._init)
            throw new Error("TezosUtil was not setup properly, perform connect()");
    };
    /**
     * Get the tx data for Atomex Contract Initiate Swap call
     *
     * @param swapDetails details of the swap being initiated
     * @returns contract address and tx data that can be used to make a contract call
     */
    TezosUtil.prototype.initiate = function (swapDetails) {
        this.status();
        if (!(swapDetails.refundTimestamp.toString().length == 10 &&
            Date.now() / 1000 < swapDetails.refundTimestamp)) {
            throw new Error("Invalid Refund Time, refund time should be in seconds and should be greater than the current time");
        }
        var parameter = this._contract.Encode("initiate", swapDetails.participant, swapDetails.hashedSecret, swapDetails.refundTimestamp, swapDetails.payoff);
        return {
            parameter: parameter,
            contractAddr: this._contractAddr,
        };
    };
    /**
     * Get the tx data for Atomex Contract Redeem Swap call
     *
     * @param secret secret that can used to verify and redeem the funds
     * @returns contract address and tx data that can be used to make a contract call
     */
    TezosUtil.prototype.redeem = function (secret) {
        this.status();
        var parameter = this._contract.Encode("redeem", secret);
        return {
            parameter: parameter,
            contractAddr: this._contractAddr,
        };
    };
    /**
     * Get the tx data for Atomex Contract Refund Swap call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    TezosUtil.prototype.refund = function (hashedSecret) {
        this.status();
        var parameter = this._contract.Encode("refund", hashedSecret);
        return {
            parameter: parameter,
            contractAddr: this._contractAddr,
        };
    };
    /**
     * Get the tx data for Atomex Contract AdditionalFunds call
     *
     * @param hashedSecret hashedSecret to identify swap
     * @returns contract address and tx data that can be used to make a contract call
     */
    TezosUtil.prototype.add = function (hashedSecret) {
        this.status();
        var parameter = this._contract.Encode("add", hashedSecret);
        return {
            parameter: parameter,
            contractAddr: this._contractAddr,
        };
    };
    /**
     * Get Block endorsements and level
     *
     * @param blockLevel block level to identify the block
     * @returns endorsements , level of the block and block generation time
     */
    TezosUtil.prototype.getBlockDetails = function (blockLevel) {
        return __awaiter(this, void 0, void 0, function () {
            var block, endorsementCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._chainClient.rpc.getBlock({
                            block: blockLevel.toString(),
                        })];
                    case 1:
                        block = _a.sent();
                        endorsementCount = 0;
                        block.operations.forEach(function (ops) {
                            ops.forEach(function (op) {
                                op.contents.forEach(function (content) {
                                    var _a, _b;
                                    if (content.kind !== "endorsement" ||
                                        !Object.prototype.hasOwnProperty.call(content, "metadata"))
                                        return;
                                    var metadata = (_a = Object.getOwnPropertyDescriptor(content, "metadata")) === null || _a === void 0 ? void 0 : _a.value;
                                    if (!Object.prototype.hasOwnProperty.call(metadata, "slots"))
                                        return;
                                    var slots = (_b = Object.getOwnPropertyDescriptor(metadata, "slots")) === null || _b === void 0 ? void 0 : _b.value;
                                    endorsementCount += slots.length;
                                });
                            });
                        });
                        return [2 /*return*/, {
                                endorsements: endorsementCount,
                                level: block.metadata.level.level,
                                time: new Date(block.header.timestamp).getTime() / 1000,
                            }];
                }
            });
        });
    };
    /**
     * Get the Swap Initiate parameters from a tx
     *
     * @param blockHeight block height of the block where the tx is present
     * @param txID operation/tx hash of the contract call
     * @param hashedSecret hashedSecret to identify swap
     */
    TezosUtil.prototype.getSwapParams = function (blockHeight, txID, hashedSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var block, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._chainClient.rpc.getBlock({
                            block: blockHeight.toString(),
                        })];
                    case 1:
                        block = _a.sent();
                        data = {};
                        try {
                            block.operations.forEach(function (ops) {
                                ops.forEach(function (op) {
                                    if (op.hash === txID) {
                                        op.contents.forEach(function (content) {
                                            if (content.kind !== "transaction")
                                                return;
                                            if (content.destination !== _this._contractAddr ||
                                                content.parameters === undefined)
                                                return;
                                            var params = _this._contract.Execute(content.parameters.value);
                                            if (params["0"] === undefined ||
                                                params["0"]["initiate"] === undefined ||
                                                params["0"]["initiate"]["settings"]["hashed_secret"] !==
                                                    hashedSecret)
                                                return;
                                            params["0"]["initiate"]["settings"]["refund_time"] = parseInt((new Date(params["0"]["initiate"]["settings"]["refund_time"]).getTime() / 1000).toFixed(0));
                                            data = params["0"]["initiate"];
                                            data = __assign(__assign({}, data), { amount: content.amount });
                                            throw "BreakException";
                                        });
                                        throw "BreakException";
                                    }
                                });
                            });
                        }
                        catch (e) {
                            if (e !== "BreakException")
                                throw e;
                            if (Object.keys(data).length === 0)
                                return [2 /*return*/, undefined];
                            return [2 /*return*/, data];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
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
    TezosUtil.prototype.validateSwapDetails = function (blockHeight, txID, expectedData, confirmations) {
        if (confirmations === void 0) { confirmations = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var swapData, amount, headDetails, txBlockDetails, confirms, lasHeadDetails, next_block_ts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSwapParams(blockHeight, txID, expectedData._hashedSecret)];
                    case 1:
                        swapData = (_a.sent());
                        if (swapData === undefined)
                            return [2 /*return*/, {
                                    status: "Invalid",
                                    confirmations: "",
                                    next_block_ts: "",
                                }];
                        swapData["settings"]["payoff"] = swapData["settings"]["payoff"].toString();
                        amount = (Number(swapData["amount"]) - Number(swapData["settings"]["payoff"])).toString();
                        if (swapData["participant"] !== expectedData._participant ||
                            swapData["settings"]["refund_time"] !== expectedData._refundTimestamp ||
                            swapData["settings"]["payoff"] !== expectedData._payoff ||
                            amount !== expectedData._amount)
                            return [2 /*return*/, {
                                    status: "Invalid",
                                    confirmations: "",
                                    next_block_ts: "",
                                }];
                        return [4 /*yield*/, this.getBlockDetails("head")];
                    case 2:
                        headDetails = _a.sent();
                        return [4 /*yield*/, this.getBlockDetails(blockHeight)];
                    case 3:
                        txBlockDetails = _a.sent();
                        confirms = headDetails.level - txBlockDetails.level;
                        if (confirms >= confirmations ||
                            headDetails.endorsements === 32 ||
                            txBlockDetails.endorsements === 32)
                            return [2 /*return*/, {
                                    status: "Confirmed",
                                    confirmations: "",
                                    next_block_ts: "",
                                }];
                        return [4 /*yield*/, this.getBlockDetails(headDetails.level - 1)];
                    case 4:
                        lasHeadDetails = _a.sent();
                        next_block_ts = 2 * headDetails.time - lasHeadDetails.time;
                        return [2 /*return*/, {
                                status: "Included",
                                confirmations: confirms.toString(),
                                next_block_ts: next_block_ts.toString(),
                            }];
                }
            });
        });
    };
    return TezosUtil;
}());
exports.TezosUtil = TezosUtil;
/**
 * Singleton instance of TezosUtil
 */
exports.Tezos = new TezosUtil();
