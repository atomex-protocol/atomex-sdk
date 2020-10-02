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
exports.cancelOrder = exports.getOrder = exports.getOrders = exports.addOrder = void 0;
var util_1 = require("../util");
var isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
var config_1 = require("../config");
exports.addOrder = function (addOrderRequest, authToken) {
    var url = new URL(config_1.getBasePath() + "/Orders");
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "post",
        body: JSON.stringify(addOrderRequest),
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
exports.getOrders = function (getOrdersRequest, authToken) {
    var url = new URL(config_1.getBasePath() + "/Orders");
    url = util_1.getQueryURL(url, __assign({}, getOrdersRequest));
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "get",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
exports.getOrder = function (orderID, authToken) {
    var url = new URL(config_1.getBasePath() + "/Orders/" + orderID);
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "get",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
exports.cancelOrder = function (id, symbol, side, authToken) {
    var url = new URL(config_1.getBasePath() + "/Orders/" + id);
    url = util_1.getQueryURL(url, { symbol: symbol, side: side });
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "delete",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    });
};
