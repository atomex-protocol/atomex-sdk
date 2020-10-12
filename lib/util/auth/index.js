"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthMessage = void 0;
/**
 * Get the details needed for `getAuthToken` request
 *
 * @remarks the `msgToSign` value needs to be signed before being used for Auth
 * @param message optional message to include for the Atomex Authentication message
 * @returns details required for Atomex Auth
 */
exports.getAuthMessage = function (message) {
    if (message === void 0) { message = ""; }
    var timeStamp = Date.now();
    return {
        timeStamp: timeStamp,
        message: message,
        msgToSign: message + timeStamp.toString(),
    };
};
