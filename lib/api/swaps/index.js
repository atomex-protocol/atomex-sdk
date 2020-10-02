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
exports.addSwapTxInfo = exports.getSwap = exports.getSwaps = exports.addSwapRequisites = void 0;
var util_1 = require("../util");
var isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
var config_1 = require("../config");
exports.addSwapRequisites = function (swapID, swapRequisites, authToken) {
    var url = new URL(config_1.getBasePath() + "/Swaps/" + swapID);
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "post",
        body: JSON.stringify(swapRequisites),
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
exports.getSwaps = function (getOrdersRequest, authToken) {
    var url = new URL(config_1.getBasePath() + "/Swaps");
    url = util_1.getQueryURL(url, __assign({}, getOrdersRequest));
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "get",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
exports.getSwap = function (swapID, authToken) {
    var url = new URL(config_1.getBasePath() + "/Swaps/" + swapID);
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "get",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
exports.addSwapTxInfo = function (swapID, txID, txType, authToken) {
    var url = new URL(config_1.getBasePath() + "/Swaps/" + swapID);
    url = util_1.getQueryURL(url, { txId: txID, type: txType });
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "post",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
