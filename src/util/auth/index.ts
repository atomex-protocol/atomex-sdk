/**
 * Get the details needed for `getAuthToken` request
 *
 * @remarks the `msgToSign` value needs to be signed before being used for Auth
 * @param message optional message to include for the Atomex Authentication message
 * @returns details required for Atomex Auth
 */
export const getAuthMessage = (message = "") => {
  const timeStamp = Date.now();
  return {
    timeStamp,
    message,
    msgToSign: message + timeStamp.toString(),
  };
};
