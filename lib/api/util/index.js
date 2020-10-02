"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryURL = void 0;
exports.getQueryURL = function (url, query) {
    Object.keys(query).forEach(function (key) { return url.searchParams.append(key, query[key]); });
    return url;
};
