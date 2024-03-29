export default {
  api: {
    mainnet: {
      baseUrl: 'https://api.atomex.me'
    },
    testnet: {
      baseUrl: 'https://api.test.atomex.me'
    },
    localhost: {
      baseUrl: 'http://127.0.0.1:5000'
    }
  },
  blockchains: {
    ethereum: {
      rpc: {
        mainnet: {
          chainID: 1,
          rpc: 'https://mainnet.infura.io/v3/7cd728d2d3384719a630d836f1693c5c',
          blockTime: 10
        },
        testnet: {
          chainID: 5,
          rpc: 'https://goerli.infura.io/v3/7cd728d2d3384719a630d836f1693c5c',
          blockTime: 10
        }
      }
    },
    tezos: {
      rpc: {
        mainnet: {
          chainID: 'NetXdQprcVkpaWU',
          rpc: 'https://rpc.tzkt.io/mainnet/',
          blockTime: 30,
          minimalFees: 100,
          minimalNanotezPerGasUnit: 0.1,
          minimalNanotezPerByte: 1,
          costPerByte: 250
        },
        testnet: {
          chainID: 'NetXnHfVqm9iesp',
          rpc: 'https://rpc.tzkt.io/ithacanet/',
          blockTime: 15,
          minimalFees: 100,
          minimalNanotezPerGasUnit: 0.1,
          minimalNanotezPerByte: 1,
          costPerByte: 250
        }
      }
    }
  },
  currencies: {
    ETH: {
      contracts: {
        mainnet: {
          address: '0xCE2003F56D33f94CF817B2B860534dF6590D4068',
          initiateGasLimitWithoutReward: 200000,
          initiateGasLimitWithReward: 210000,
          redeemGasLimit: 140000
        },
        testnet: {
          address: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b',
          initiateGasLimitWithoutReward: 200000,
          initiateGasLimitWithReward: 210000,
          redeemGasLimit: 140000
        },
        abi: [
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              }
            ],
            name: 'Activated',
            type: 'event'
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              },
              {
                indexed: false,
                internalType: 'address',
                name: '_sender',
                type: 'address'
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: '_value',
                type: 'uint256'
              }
            ],
            name: 'Added',
            type: 'event'
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              },
              {
                indexed: true,
                internalType: 'address',
                name: '_participant',
                type: 'address'
              },
              {
                indexed: false,
                internalType: 'address',
                name: '_initiator',
                type: 'address'
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: '_refundTimestamp',
                type: 'uint256'
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: '_countdown',
                type: 'uint256'
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: '_value',
                type: 'uint256'
              },
              {
                indexed: false,
                internalType: 'uint256',
                name: '_payoff',
                type: 'uint256'
              },
              {
                indexed: false,
                internalType: 'bool',
                name: '_active',
                type: 'bool'
              }
            ],
            name: 'Initiated',
            type: 'event'
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              },
              {
                indexed: false,
                internalType: 'bytes32',
                name: '_secret',
                type: 'bytes32'
              }
            ],
            name: 'Redeemed',
            type: 'event'
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              }
            ],
            name: 'Refunded',
            type: 'event'
          },
          {
            constant: true,
            inputs: [
              {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
              }
            ],
            name: 'swaps',
            outputs: [
              {
                internalType: 'bytes32',
                name: 'hashedSecret',
                type: 'bytes32'
              },
              {
                internalType: 'address payable',
                name: 'initiator',
                type: 'address'
              },
              {
                internalType: 'address payable',
                name: 'participant',
                type: 'address'
              },
              {
                internalType: 'uint256',
                name: 'refundTimestamp',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'countdown',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: 'payoff',
                type: 'uint256'
              },
              {
                internalType: 'bool',
                name: 'active',
                type: 'bool'
              },
              {
                internalType: 'enum Atomex.State',
                name: 'state',
                type: 'uint8'
              }
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function'
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              },
              {
                internalType: 'address payable',
                name: '_participant',
                type: 'address'
              },
              {
                internalType: 'uint256',
                name: '_refundTimestamp',
                type: 'uint256'
              },
              {
                internalType: 'uint256',
                name: '_payoff',
                type: 'uint256'
              }
            ],
            name: 'initiate',
            outputs: [],
            payable: true,
            stateMutability: 'payable',
            type: 'function'
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              }
            ],
            name: 'add',
            outputs: [],
            payable: true,
            stateMutability: 'payable',
            type: 'function'
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              }
            ],
            name: 'activate',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              },
              {
                internalType: 'bytes32',
                name: '_secret',
                type: 'bytes32'
              }
            ],
            name: 'redeem',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          },
          {
            constant: false,
            inputs: [
              {
                internalType: 'bytes32',
                name: '_hashedSecret',
                type: 'bytes32'
              }
            ],
            name: 'refund',
            outputs: [],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ]
      },
      decimals: {
        original: 18,
        displayed: 4
      },
      blockchain: 'ethereum'
    },
    XTZ: {
      contracts: {
        mainnet: {
          address: 'KT1VG2WtYdSWz5E7chTeAdDPZNy2MpP8pTfL',
          redeemTxSize: 133,
          initiateTxSize: 200,
          gasLimit: 15000
        },
        testnet: {
          address: 'KT1SJMtHZFSPva5AzQEx5btBuQ8BjvXqort3',
          redeemTxSize: 133,
          initiateTxSize: 200,
          gasLimit: 85000
        },
        entrypoints: {
          default: {
            prim: 'or',
            args: [
              {
                prim: 'or',
                args: [
                  {
                    prim: 'pair',
                    args: [
                      {
                        prim: 'address',
                        annots: [
                          '%participant'
                        ]
                      },
                      {
                        prim: 'pair',
                        args: [
                          {
                            prim: 'pair',
                            args: [
                              {
                                prim: 'bytes',
                                annots: [
                                  '%hashed_secret'
                                ]
                              },
                              {
                                prim: 'timestamp',
                                annots: [
                                  '%refund_time'
                                ]
                              }
                            ]
                          },
                          {
                            prim: 'mutez',
                            annots: [
                              '%payoff'
                            ]
                          }
                        ],
                        annots: [
                          '%settings'
                        ]
                      }
                    ],
                    annots: [
                      ':initiate',
                      '%initiate'
                    ]
                  },
                  {
                    prim: 'bytes',
                    annots: [
                      ':hashed_secret',
                      '%add'
                    ]
                  }
                ],
                annots: [
                  '%fund'
                ]
              },
              {
                prim: 'or',
                args: [
                  {
                    prim: 'bytes',
                    annots: [
                      ':secret',
                      '%redeem'
                    ]
                  },
                  {
                    prim: 'bytes',
                    annots: [
                      ':hashed_secret',
                      '%refund'
                    ]
                  }
                ],
                annots: [
                  '%withdraw'
                ]
              }
            ]
          },
          withdraw: {
            prim: 'or',
            args: [
              {
                prim: 'bytes',
                annots: [
                  ':secret',
                  '%redeem'
                ]
              },
              {
                prim: 'bytes',
                annots: [
                  ':hashed_secret',
                  '%refund'
                ]
              }
            ]
          },
          refund: {
            prim: 'bytes',
            annots: [
              ':hashed_secret'
            ]
          },
          redeem: {
            prim: 'bytes',
            annots: [
              ':secret'
            ]
          },
          initiate: {
            prim: 'pair',
            args: [
              {
                prim: 'address',
                annots: [
                  '%participant'
                ]
              },
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'pair',
                    args: [
                      {
                        prim: 'bytes',
                        annots: [
                          '%hashed_secret'
                        ]
                      },
                      {
                        prim: 'timestamp',
                        annots: [
                          '%refund_time'
                        ]
                      }
                    ]
                  },
                  {
                    prim: 'mutez',
                    annots: [
                      '%payoff'
                    ]
                  }
                ],
                annots: [
                  '%settings'
                ]
              }
            ],
            annots: [
              ':initiate'
            ]
          },
          fund: {
            prim: 'or',
            args: [
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'address',
                    annots: [
                      '%participant'
                    ]
                  },
                  {
                    prim: 'pair',
                    args: [
                      {
                        prim: 'pair',
                        args: [
                          {
                            prim: 'bytes',
                            annots: [
                              '%hashed_secret'
                            ]
                          },
                          {
                            prim: 'timestamp',
                            annots: [
                              '%refund_time'
                            ]
                          }
                        ]
                      },
                      {
                        prim: 'mutez',
                        annots: [
                          '%payoff'
                        ]
                      }
                    ],
                    annots: [
                      '%settings'
                    ]
                  }
                ],
                annots: [
                  ':initiate',
                  '%initiate'
                ]
              },
              {
                prim: 'bytes',
                annots: [
                  ':hashed_secret',
                  '%add'
                ]
              }
            ]
          },
          add: {
            prim: 'bytes',
            annots: [
              ':hashed_secret'
            ]
          }
        }
      },
      decimals: {
        original: 6,
        displayed: 3
      },
      blockchain: 'tezos'
    },
    TZBTC: {
      contracts: {
        mainnet: {
          address: 'KT1Ap287P1NzsnToSJdA4aqSNjPomRaHBZSr',
          tokenAddress: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          redeemTxSize: 133,
          initiateTxSize: 250,
          gasLimit: 100000
        },
        testnet: {
          address: 'KT1Jj1jzDQbDRHt4u7M73DUrBDV1napRbNFr',
          tokenAddress: '',
          redeemTxSize: 133,
          initiateTxSize: 250,
          gasLimit: 100000
        },
        entrypoints: {
          default: {
            prim: 'or',
            args: [
              {
                prim: 'or',
                args: [
                  {
                    prim: 'pair',
                    args: [
                      {
                        prim: 'pair',
                        args: [
                          {
                            prim: 'pair',
                            args: [
                              {
                                prim: 'bytes',
                                annots: [
                                  '%hashedSecret'
                                ]
                              },
                              {
                                prim: 'address',
                                annots: [
                                  '%participant'
                                ]
                              }
                            ]
                          },
                          {
                            prim: 'pair',
                            args: [
                              {
                                prim: 'nat',
                                annots: [
                                  '%payoffAmount'
                                ]
                              },
                              {
                                prim: 'timestamp',
                                annots: [
                                  '%refundTime'
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        prim: 'pair',
                        args: [
                          {
                            prim: 'address',
                            annots: [
                              '%tokenAddress'
                            ]
                          },
                          {
                            prim: 'nat',
                            annots: [
                              '%totalAmount'
                            ]
                          }
                        ]
                      }
                    ],
                    annots: [
                      '%initiate'
                    ]
                  },
                  {
                    prim: 'bytes',
                    annots: [
                      '%redeem'
                    ]
                  }
                ]
              },
              {
                prim: 'bytes',
                annots: [
                  '%refund'
                ]
              }
            ]
          },
          refund: {
            prim: 'bytes'
          },
          redeem: {
            prim: 'bytes'
          },
          initiate: {
            prim: 'pair',
            args: [
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'pair',
                    args: [
                      {
                        prim: 'bytes',
                        annots: [
                          '%hashedSecret'
                        ]
                      },
                      {
                        prim: 'address',
                        annots: [
                          '%participant'
                        ]
                      }
                    ]
                  },
                  {
                    prim: 'nat',
                    annots: [
                      '%payoffAmount'
                    ]
                  },
                  {
                    prim: 'timestamp',
                    annots: [
                      '%refundTime'
                    ]
                  }
                ]
              },
              {
                prim: 'address',
                annots: [
                  '%tokenAddress'
                ]
              },
              {
                prim: 'nat',
                annots: [
                  '%totalAmount'
                ]
              }
            ]
          }
        }
      },
      decimals: {
        original: 8,
        displayed: 4
      },
      blockchain: 'tezos'
    },
    USDT_XTZ: {
      contracts: {
        mainnet: {
          address: 'KT1Ays1Chwx3ArnHGoQXchUgDsvKe9JboUjj',
          tokenAddress: 'KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o',
          redeemTxSize: 20000,
          initiateTxSize: 20000,
          gasLimit: 400000
        },
        testnet: {
          address: 'KT1HHjNxi3okxxGJT1SPPhpcs3gMQt8hqixY',
          tokenAddress: 'KT1BWvRQnVVowZZLGkct9A7sdj5YEe8CdUhR',
          redeemTxSize: 20000,
          initiateTxSize: 20000,
          gasLimit: 400000
        },
        entrypoints: {
          default: {
            prim: 'or',
            args: [
              {
                prim: 'or',
                args: [
                  {
                    prim: 'pair',
                    args: [
                      {
                        prim: 'pair',
                        args: [
                          {
                            prim: 'pair',
                            args: [
                              {
                                prim: 'bytes',
                                annots: [
                                  '%hashedSecret'
                                ]
                              },
                              {
                                prim: 'address',
                                annots: [
                                  '%participant'
                                ]
                              }
                            ]
                          },
                          {
                            prim: 'pair',
                            args: [
                              {
                                prim: 'nat',
                                annots: [
                                  '%payoffAmount'
                                ]
                              },
                              {
                                prim: 'timestamp',
                                annots: [
                                  '%refundTime'
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        prim: 'pair',
                        args: [
                          {
                            prim: 'pair',
                            args: [
                              {
                                prim: 'address',
                                annots: [
                                  '%tokenAddress'
                                ]
                              },
                              {
                                prim: 'nat',
                                annots: [
                                  '%tokenId'
                                ]
                              }
                            ]
                          },
                          {
                            prim: 'nat',
                            annots: [
                              '%totalAmount'
                            ]
                          }
                        ]
                      }
                    ],
                    annots: [
                      '%initiate'
                    ]
                  },
                  {
                    prim: 'bytes',
                    annots: [
                      '%redeem'
                    ]
                  }
                ]
              },
              {
                prim: 'bytes',
                annots: [
                  '%refund'
                ]
              }
            ]
          },
          refund: {
            prim: 'bytes'
          },
          redeem: {
            prim: 'bytes'
          },
          initiate: {
            prim: 'pair',
            args: [
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'pair',
                    args: [
                      {
                        prim: 'bytes',
                        annots: [
                          '%hashedSecret'
                        ]
                      },
                      {
                        prim: 'address',
                        annots: [
                          '%participant'
                        ]
                      }
                    ]
                  },
                  {
                    prim: 'nat',
                    annots: [
                      '%payoffAmount'
                    ]
                  },
                  {
                    prim: 'timestamp',
                    annots: [
                      '%refundTime'
                    ]
                  }
                ]
              },
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'address',
                    annots: [
                      '%tokenAddress'
                    ]
                  },
                  {
                    prim: 'nat',
                    annots: [
                      '%tokenId'
                    ]
                  }
                ]
              },
              {
                prim: 'nat',
                annots: [
                  '%totalAmount'
                ]
              }
            ]
          }
        }
      },
      decimals: {
        original: 6,
        displayed: 4
      },
      blockchain: 'tezos'
    }
  }
};
