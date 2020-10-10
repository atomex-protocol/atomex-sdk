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
exports.Ethereum = exports.EthereumUtil = void 0;
var web3_1 = __importDefault(require("web3"));
var config_json_1 = __importDefault(require("../../config.json"));
var EthereumUtil = /** @class */ (function () {
    function EthereumUtil() {
        this._init = false;
    }
    EthereumUtil.prototype.connect = function (rpc) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var web3, chainID, conf;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        web3 = new web3_1.default(rpc);
                        return [4 /*yield*/, web3.eth.getChainId()];
                    case 1:
                        chainID = _b.sent();
                        conf = config_json_1.default.ethereum;
                        if (!Object.prototype.hasOwnProperty.call(conf.chains, chainID.toString())) {
                            throw new Error("Chain wit Chain-ID " + chainID + " Not Supported");
                        }
                        this._rpc = rpc;
                        this._chainClient = web3;
                        this._contract = new web3.eth.Contract(config_json_1.default.ethereum.abi, (_a = Object.getOwnPropertyDescriptor(conf.chains, chainID.toString())) === null || _a === void 0 ? void 0 : _a.value.contract);
                        this._init = true;
                        return [2 /*return*/, chainID];
                }
            });
        });
    };
    EthereumUtil.prototype.status = function () {
        if (!this._init)
            throw new Error("EthereumUtil was not setup properly");
    };
    EthereumUtil.prototype.initiate = function (_a) {
        var hashedSecret = _a.hashedSecret, participant = _a.participant, refundTimestamp = _a.refundTimestamp, payoff = _a.payoff, active = _a.active, countdown = _a.countdown;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.status();
                        if (!(refundTimestamp.toString().length == 10 &&
                            Date.now() / 1000 < refundTimestamp)) {
                            throw new Error("Invalid Refund Time, refund time should be in seconds and should be greater than the current time");
                        }
                        return [4 /*yield*/, this._contract.methods
                                .initiate(hashedSecret, participant, refundTimestamp, countdown !== undefined ? countdown : refundTimestamp - 1, payoff, active !== undefined ? active : true)
                                .encodeABI()];
                    case 1:
                        data = _b.sent();
                        return [2 /*return*/, {
                                data: data,
                                contractAddr: this._contract.options.address,
                            }];
                }
            });
        });
    };
    EthereumUtil.prototype.redeem = function (secret) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status();
                        return [4 /*yield*/, this._contract.methods
                                .redeem(secret)
                                .encodeABI()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                contractAddr: this._contract.options.address,
                            }];
                }
            });
        });
    };
    EthereumUtil.prototype.refund = function (hashedSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status();
                        return [4 /*yield*/, this._contract.methods
                                .refund(hashedSecret)
                                .encodeABI()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                contractAddr: this._contract.options.address,
                            }];
                }
            });
        });
    };
    EthereumUtil.prototype.add = function (hashedSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status();
                        return [4 /*yield*/, this._contract.methods
                                .add(hashedSecret)
                                .encodeABI()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                contractAddr: this._contract.options.address,
                            }];
                }
            });
        });
    };
    EthereumUtil.prototype.activate = function (hashedSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.status();
                        return [4 /*yield*/, this._contract.methods
                                .activate(hashedSecret)
                                .encodeABI()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                contractAddr: this._contract.options.address,
                            }];
                }
            });
        });
    };
    EthereumUtil.prototype.getTxData = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var txData, input, value, blockNumber, to, returnData, _i, _a, object, signature, args, i;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._chainClient.eth.getTransaction(txHash)];
                    case 1:
                        txData = _c.sent();
                        if (txData.blockNumber === null)
                            return [2 /*return*/, undefined];
                        input = txData.input, value = txData.value, blockNumber = txData.blockNumber, to = txData.to;
                        returnData = {
                            to: to,
                            amount: "",
                            blockHeight: blockNumber,
                            name: "",
                            parameters: {},
                        };
                        for (_i = 0, _a = config_json_1.default.ethereum.abi; _i < _a.length; _i++) {
                            object = _a[_i];
                            if (object.type !== "function")
                                continue;
                            signature = this._chainClient.eth.abi.encodeFunctionSignature(object);
                            if (input.startsWith(signature)) {
                                args = this._chainClient.eth.abi.decodeParameters(object.inputs || [], input.slice(signature.length));
                                if (object.inputs === undefined)
                                    continue;
                                returnData.name = object.name || "";
                                for (i = 0; i < args.__length__; i++)
                                    returnData.parameters = __assign(__assign({}, returnData.parameters), (_b = {}, _b[object.inputs[i].name] = args[i], _b));
                                returnData.amount = this._chainClient.utils
                                    .toBN(value)
                                    .sub(this._chainClient.utils.toBN(returnData.parameters["_payoff"]))
                                    .toString();
                                break;
                            }
                        }
                        return [2 /*return*/, returnData];
                }
            });
        });
    };
    EthereumUtil.prototype.validateSwapTransaction = function (txHash, expectedData, confirmations) {
        var _a;
        if (confirmations === void 0) { confirmations = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var txData, currentBlock, keys, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getTxData(txHash)];
                    case 1:
                        txData = _b.sent();
                        if (txData === undefined ||
                            txData.name !== "initiate" ||
                            txData.to !== this._contract.options.address)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this._chainClient.eth.getBlockNumber()];
                    case 2:
                        currentBlock = _b.sent();
                        if (currentBlock - txData.blockHeight < confirmations ||
                            txData.amount !== expectedData._amount)
                            return [2 /*return*/, false];
                        keys = Object.keys(txData.parameters);
                        for (i = 0; i < keys.length; i++)
                            if (Object.prototype.hasOwnProperty.call(expectedData, keys[i]) &&
                                ((_a = Object.getOwnPropertyDescriptor(expectedData, keys[i])) === null || _a === void 0 ? void 0 : _a.value.toString()) !== txData.parameters[keys[i]])
                                return [2 /*return*/, false];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return EthereumUtil;
}());
exports.EthereumUtil = EthereumUtil;
exports.Ethereum = new EthereumUtil();
