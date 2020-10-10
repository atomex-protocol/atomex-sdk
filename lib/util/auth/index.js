"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthMessage = void 0;
exports.getAuthMessage = function (message) {
    if (message === void 0) { message = ""; }
    var timeStamp = Date.now();
    return {
        timeStamp: timeStamp,
        message: message,
        msgToSign: message + timeStamp.toString(),
    };
};
