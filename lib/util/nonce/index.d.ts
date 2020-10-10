export declare const getNonce: () => string;
export declare const getTimeStamp: () => string;
export declare const getAuthMessage: () => {
    timeStamp: string;
    nonce: string;
    message: string;
};
