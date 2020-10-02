"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasePath = void 0;
var config = {
    basePath: "https://api.test.atomex.me/",
    version: "v1",
};
exports.getBasePath = function () {
    return config.basePath + config.version;
};
