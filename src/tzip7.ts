import { TezosHelpers } from "./tezos";
import { OperationContentsAndResultTransaction } from "@taquito/rpc";
import { InitiateParameters } from "./types";
import { dt2ts } from "./helpers";

/**
 * TZIP-7 Util class for Tezos FA1.2 tokens related Atomex helper functions
 */
 export class Tzip7Helpers extends TezosHelpers {

    parseInitiateParameters(
        content: OperationContentsAndResultTransaction,
      ): InitiateParameters {
        if (content.parameters === undefined) {
          throw new Error("Parameters are undefined");
        }

        const params = this._entrypoints
          .get(content.parameters.entrypoint)
          ?.Execute(content.parameters.value);
        if (params === undefined) {
          throw new Error(
            `Unexpected entrypoint: ${content.parameters.entrypoint}`,
          );
        }
    
        const initiateParams = (() => {
          switch (content.parameters.entrypoint) {
            case "initiate":
              return params;
            case "default":
              return params["initiate"];
            default:
              throw new Error(
                `Unexpected entrypoint: ${content.parameters.entrypoint}`,
              );
          }
        })();
            
        return {
          secretHash: initiateParams["hashedSecret"],
          receivingAddress: initiateParams["participant"],
          refundTimestamp: dt2ts(initiateParams["refundTime"]),
          netAmount: parseInt(initiateParams["totalAmount"]) - parseInt(initiateParams["payoffAmount"]),
          rewardForRedeem: parseInt(initiateParams["payoffAmount"]),
        };
      }
 }