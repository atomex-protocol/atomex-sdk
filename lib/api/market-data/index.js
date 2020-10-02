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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandlesHistory = exports.getOrderBook = exports.getTopBookQuotes = void 0;
var util_1 = require("../util");
var isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
var config_1 = require("../config");
exports.getTopBookQuotes = function (symbolList) {
    var symbols = symbolList !== undefined && symbolList.length > 0
        ? symbolList.join(",")
        : "All";
    var url = new URL(config_1.getBasePath() + "/MarketData/quotes");
    url = util_1.getQueryURL(url, { symbols: symbols });
    console.log(url.toString());
    return isomorphic_unfetch_1.default(url.toString());
};
exports.getOrderBook = function (symbol) {
    var url = new URL(config_1.getBasePath() + "/MarketData/book");
    url = util_1.getQueryURL(url, { symbol: symbol });
    return isomorphic_unfetch_1.default(url.toString());
};
exports.getCandlesHistory = function (candleRequest) {
    var url = new URL(config_1.getBasePath() + "/MarketData/candles");
    url = util_1.getQueryURL(url, __assign({}, candleRequest));
    return isomorphic_unfetch_1.default(url.toString());
};
