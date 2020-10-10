"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectTezos = exports.connectEthereum = exports.getBasePath = void 0;
var config = {
    basePath: "https://api.test.atomex.me/",
    version: "v1",
    ethereum: {
        contract: "0xe9c251cbb4881f9e056e40135e7d3ea9a7d037df",
        rpc: "",
    },
    tezos: {
        contract: "KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL",
        rpc: "",
    },
};
exports.getBasePath = function () {
    return config.basePath + config.version;
};
exports.connectEthereum = function (rpc) {
    config.ethereum.rpc = rpc;
};
exports.connectTezos = function (rpc) {
    config.tezos.rpc = rpc;
};
