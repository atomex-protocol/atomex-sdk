import type { EthereumAtomexProtocolV1Options } from '../models/index';

export const mainnetEthereumAtomexProtocolV1Options: EthereumAtomexProtocolV1Options = {
  atomexProtocolVersion: 1,
  currencyId: 'ETH',
  swapContractAddress: '0xe9c251cbb4881f9e056e40135e7d3ea9a7d037df',
  swapContractBlockId: '8168569',
  initiateOperation: {
    gasLimit: {
      withoutReward: 200000,
      withReward: 210000
    }
  },
  redeemOperation: {
    gasLimit: 140000
  },
  refundOperation: {
    gasLimit: 90000
  },
  defaultGasPriceInGwei: 90,
  maxGasPriceInGwei: 650,
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
};

export const testnetEthereumAtomexProtocolV1Options: EthereumAtomexProtocolV1Options = {
  ...mainnetEthereumAtomexProtocolV1Options,
  swapContractAddress: '0x512fe6B803bA327DCeFBF2Cec7De333f761B0f2b',
  swapContractBlockId: '6954501',
};
