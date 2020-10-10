export const getAuthMessage = (message = "") => {
  const timeStamp = Date.now();
  return {
    timeStamp,
    message,
    msgToSign: message + timeStamp.toString(),
  };
};
