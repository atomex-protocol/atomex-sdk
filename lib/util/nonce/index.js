"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthMessage = exports.getTimeStamp = exports.getNonce = void 0;
var crypto_1 = require("crypto");
exports.getNonce = function () {
    return crypto_1.randomBytes(16).toString("hex");
};
exports.getTimeStamp = function () {
    return new Date().toISOString().replace("T", " ");
};
exports.getAuthMessage = function () {
    var timeStamp = exports.getTimeStamp(), nonce = exports.getNonce();
    return {
        timeStamp: timeStamp,
        nonce: nonce,
        message: timeStamp + ":" + nonce,
    };
};
