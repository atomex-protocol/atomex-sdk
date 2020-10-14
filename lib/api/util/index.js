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
exports.makeApiRequest = exports.getBasePath = exports.connect = exports.getQueryURL = exports.instanceConfig = void 0;
var isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
var config_json_1 = __importDefault(require("../../config.json"));
/**
 * Atomex API instance config
 * @ignore
 */
exports.instanceConfig = {
    basePath: config_json_1.default.api.mainnet.basePath,
    version: config_json_1.default.api.mainnet.version,
};
/**
 * Helper function to append query params to a url
 *
 * @param url url to append query params
 * @param query key:value pair listing all the query params
 * @ignore
 */
exports.getQueryURL = function (url, query) {
    Object.keys(query).forEach(function (key) { return url.searchParams.append(key, query[key]); });
    return url;
};
/**
 * Setup Atomex API connection
 *
 * @param network networks supported by Atomex, can be either mainnet or testnet
 */
exports.connect = function (network) {
    exports.instanceConfig = {
        basePath: config_json_1.default.api[network].basePath,
        version: config_json_1.default.api[network].version,
    };
};
/**
 * Helper function to get base path for atomex api
 * @ignore
 */
exports.getBasePath = function () {
    return exports.instanceConfig.basePath + exports.instanceConfig.version;
};
/**
 * Helper function to make Atomex API calls
 *
 * @param url url to make api request
 * @param options all options for the request
 * @returns response from the request
 *
 * @ignore
 */
exports.makeApiRequest = function (url, options) { return __awaiter(void 0, void 0, void 0, function () {
    var response, errBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, isomorphic_unfetch_1.default(url, __assign({}, options))];
            case 1:
                response = _a.sent();
                if (!response.ok) return [3 /*break*/, 2];
                return [2 /*return*/, response.json()];
            case 2: return [4 /*yield*/, response.text()];
            case 3:
                errBody = _a.sent();
                throw Error(errBody);
        }
    });
}); };
