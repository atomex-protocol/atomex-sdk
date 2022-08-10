declare const _default: {
    api: {
        mainnet: {
            baseUrl: string;
        };
        testnet: {
            baseUrl: string;
        };
        localhost: {
            baseUrl: string;
        };
    };
    blockchains: {
        ethereum: {
            rpc: {
                mainnet: {
                    chainID: number;
                    rpc: string;
                    blockTime: number;
                };
                testnet: {
                    chainID: number;
                    rpc: string;
                    blockTime: number;
                };
            };
        };
        tezos: {
            rpc: {
                mainnet: {
                    chainID: string;
                    rpc: string;
                    blockTime: number;
                    minimalFees: number;
                    minimalNanotezPerGasUnit: number;
                    minimalNanotezPerByte: number;
                    costPerByte: number;
                };
                testnet: {
                    chainID: string;
                    rpc: string;
                    blockTime: number;
                    minimalFees: number;
                    minimalNanotezPerGasUnit: number;
                    minimalNanotezPerByte: number;
                    costPerByte: number;
                };
            };
        };
    };
    currencies: {
        ETH: {
            contracts: {
                mainnet: {
                    address: string;
                    gasLimit: number;
                };
                testnet: {
                    address: string;
                    gasLimit: number;
                };
                abi: ({
                    anonymous: boolean;
                    inputs: {
                        indexed: boolean;
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    name: string;
                    type: string;
                    constant?: undefined;
                    outputs?: undefined;
                    payable?: undefined;
                    stateMutability?: undefined;
                } | {
                    constant: boolean;
                    inputs: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    name: string;
                    outputs: {
                        internalType: string;
                        name: string;
                        type: string;
                    }[];
                    payable: boolean;
                    stateMutability: string;
                    type: string;
                    anonymous?: undefined;
                })[];
            };
            decimals: {
                original: number;
                displayed: number;
            };
            blockchain: string;
        };
        XTZ: {
            contracts: {
                mainnet: {
                    address: string;
                    redeemTxSize: number;
                    initiateTxSize: number;
                    gasLimit: number;
                };
                testnet: {
                    address: string;
                    redeemTxSize: number;
                    initiateTxSize: number;
                    gasLimit: number;
                };
                entrypoints: {
                    default: {
                        prim: string;
                        args: {
                            prim: string;
                            args: ({
                                prim: string;
                                args: ({
                                    prim: string;
                                    annots: string[];
                                    args?: undefined;
                                } | {
                                    prim: string;
                                    args: ({
                                        prim: string;
                                        args: {
                                            prim: string;
                                            annots: string[];
                                        }[];
                                        annots?: undefined;
                                    } | {
                                        prim: string;
                                        annots: string[];
                                        args?: undefined;
                                    })[];
                                    annots: string[];
                                })[];
                                annots: string[];
                            } | {
                                prim: string;
                                annots: string[];
                                args?: undefined;
                            })[];
                            annots: string[];
                        }[];
                    };
                    withdraw: {
                        prim: string;
                        args: {
                            prim: string;
                            annots: string[];
                        }[];
                    };
                    refund: {
                        prim: string;
                        annots: string[];
                    };
                    redeem: {
                        prim: string;
                        annots: string[];
                    };
                    initiate: {
                        prim: string;
                        args: ({
                            prim: string;
                            annots: string[];
                            args?: undefined;
                        } | {
                            prim: string;
                            args: ({
                                prim: string;
                                args: {
                                    prim: string;
                                    annots: string[];
                                }[];
                                annots?: undefined;
                            } | {
                                prim: string;
                                annots: string[];
                                args?: undefined;
                            })[];
                            annots: string[];
                        })[];
                        annots: string[];
                    };
                    fund: {
                        prim: string;
                        args: ({
                            prim: string;
                            args: ({
                                prim: string;
                                annots: string[];
                                args?: undefined;
                            } | {
                                prim: string;
                                args: ({
                                    prim: string;
                                    args: {
                                        prim: string;
                                        annots: string[];
                                    }[];
                                    annots?: undefined;
                                } | {
                                    prim: string;
                                    annots: string[];
                                    args?: undefined;
                                })[];
                                annots: string[];
                            })[];
                            annots: string[];
                        } | {
                            prim: string;
                            annots: string[];
                            args?: undefined;
                        })[];
                    };
                    add: {
                        prim: string;
                        annots: string[];
                    };
                };
            };
            decimals: {
                original: number;
                displayed: number;
            };
            blockchain: string;
        };
        TZBTC: {
            contracts: {
                mainnet: {
                    address: string;
                    tokenAddress: string;
                    redeemTxSize: number;
                    initiateTxSize: number;
                    gasLimit: number;
                };
                testnet: {
                    address: string;
                    tokenAddress: string;
                    redeemTxSize: number;
                    initiateTxSize: number;
                    gasLimit: number;
                };
                entrypoints: {
                    default: {
                        prim: string;
                        args: ({
                            prim: string;
                            args: ({
                                prim: string;
                                args: ({
                                    prim: string;
                                    args: {
                                        prim: string;
                                        args: {
                                            prim: string;
                                            annots: string[];
                                        }[];
                                    }[];
                                } | {
                                    prim: string;
                                    args: {
                                        prim: string;
                                        annots: string[];
                                    }[];
                                })[];
                                annots: string[];
                            } | {
                                prim: string;
                                annots: string[];
                                args?: undefined;
                            })[];
                            annots?: undefined;
                        } | {
                            prim: string;
                            annots: string[];
                            args?: undefined;
                        })[];
                    };
                    refund: {
                        prim: string;
                    };
                    redeem: {
                        prim: string;
                    };
                    initiate: {
                        prim: string;
                        args: ({
                            prim: string;
                            args: ({
                                prim: string;
                                args: {
                                    prim: string;
                                    annots: string[];
                                }[];
                                annots?: undefined;
                            } | {
                                prim: string;
                                annots: string[];
                                args?: undefined;
                            })[];
                            annots?: undefined;
                        } | {
                            prim: string;
                            annots: string[];
                            args?: undefined;
                        })[];
                    };
                };
            };
            decimals: {
                original: number;
                displayed: number;
            };
            blockchain: string;
        };
        USDT_XTZ: {
            contracts: {
                mainnet: {
                    address: string;
                    tokenAddress: string;
                    redeemTxSize: number;
                    initiateTxSize: number;
                    gasLimit: number;
                };
                testnet: {
                    address: string;
                    tokenAddress: string;
                    redeemTxSize: number;
                    initiateTxSize: number;
                    gasLimit: number;
                };
                entrypoints: {
                    default: {
                        prim: string;
                        args: ({
                            prim: string;
                            args: ({
                                prim: string;
                                args: {
                                    prim: string;
                                    args: ({
                                        prim: string;
                                        args: {
                                            prim: string;
                                            annots: string[];
                                        }[];
                                        annots?: undefined;
                                    } | {
                                        prim: string;
                                        annots: string[];
                                        args?: undefined;
                                    })[];
                                }[];
                                annots: string[];
                            } | {
                                prim: string;
                                annots: string[];
                                args?: undefined;
                            })[];
                            annots?: undefined;
                        } | {
                            prim: string;
                            annots: string[];
                            args?: undefined;
                        })[];
                    };
                    refund: {
                        prim: string;
                    };
                    redeem: {
                        prim: string;
                    };
                    initiate: {
                        prim: string;
                        args: ({
                            prim: string;
                            args: ({
                                prim: string;
                                args: {
                                    prim: string;
                                    annots: string[];
                                }[];
                                annots?: undefined;
                            } | {
                                prim: string;
                                annots: string[];
                                args?: undefined;
                            })[];
                            annots?: undefined;
                        } | {
                            prim: string;
                            annots: string[];
                            args?: undefined;
                        })[];
                    };
                };
            };
            decimals: {
                original: number;
                displayed: number;
            };
            blockchain: string;
        };
    };
};
export default _default;
