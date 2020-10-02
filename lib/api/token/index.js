"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = void 0;
var isomorphic_unfetch_1 = __importDefault(require("isomorphic-unfetch"));
var config_1 = require("../config");
exports.getAuthToken = function (authParam) {
    var url = new URL(config_1.getBasePath() + "/Token");
    return isomorphic_unfetch_1.default(url.toString(), {
        method: "post",
        body: JSON.stringify(authParam),
    });
};
