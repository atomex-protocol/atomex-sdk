/* eslint-disable @typescript-eslint/no-explicit-any */
import BigNumber from 'bignumber.js';

import type { Swap } from '../../../src';
import type { SwapPreview, SwapPreviewParameters } from '../../../src/atomex/models';
import type { ExchangeSymbol, OrderBook } from '../../../src/exchange';
import type { Accounts } from './accounts';
import { AtomexProtocolMultiChainFees, validAtomexProtocolMultiChainFees } from './atomexProtocolFees';
import { validExchangeSymbols } from './exchangeSymbols';
import { validOrderBooks } from './orderBooks';

const swaps: Swap[] = [
  {
    id: 100,
    isInitiator: false,
    from: {
      currencyId: 'XTZ',
      amount: new BigNumber('55'),
      price: new BigNumber('0.000948468'),
    },
    to: {
      currencyId: 'ETH',
      amount: new BigNumber('0.05216574'),
      price: new BigNumber('1054.331827747'),
    },
    trade: {
      price: new BigNumber('0.000948468'),
      qty: new BigNumber('55'),
      side: 'Sell',
      symbol: 'XTZ/ETH'
    },
    user: {
      status: 'Involved',
      trades: [],
      transactions: [],
      requisites: {
        lockTime: 18000,
        baseCurrencyContract: '',
        quoteCurrencyContract: '',
        receivingAddress: '',
        refundAddress: null,
        secretHash: null,
        rewardForRedeem: new BigNumber(0)
      }
    },
    counterParty: {
      status: 'Involved',
      trades: [],
      transactions: [],
      requisites: {
        lockTime: 36000,
        baseCurrencyContract: '',
        quoteCurrencyContract: '',
        receivingAddress: '',
        refundAddress: null,
        secretHash: null,
        rewardForRedeem: new BigNumber(0)
      }
    },
    secret: null,
    secretHash: '',
    timeStamp: new Date()
  },
  {
    id: 89,
    isInitiator: false,
    from: {
      currencyId: 'XTZ',
      amount: new BigNumber('13'),
      price: new BigNumber('0.000948468'),
    },
    to: {
      currencyId: 'ETH',
      amount: new BigNumber('0.05216574'),
      price: new BigNumber('1054.331827747'),
    },
    trade: {
      price: new BigNumber('0.000948468'),
      qty: new BigNumber('13'),
      side: 'Sell',
      symbol: 'XTZ/ETH'
    },
    user: {
      status: 'Involved',
      trades: [],
      transactions: [],
      requisites: {
        lockTime: 18000,
        baseCurrencyContract: '',
        quoteCurrencyContract: '',
        receivingAddress: '',
        refundAddress: null,
        secretHash: null,
        rewardForRedeem: new BigNumber(0)
      }
    },
    counterParty: {
      status: 'Involved',
      trades: [],
      transactions: [],
      requisites: {
        lockTime: 36000,
        baseCurrencyContract: '',
        quoteCurrencyContract: '',
        receivingAddress: '',
        refundAddress: null,
        secretHash: null,
        rewardForRedeem: new BigNumber(0)
      }
    },
    secret: null,
    secretHash: '',
    timeStamp: new Date()
  },
];

const swapPreviewWithoutAccountTestCases: ReadonlyArray<[
  message: string,
  swapPreviewParameters: SwapPreviewParameters,
  expectedSwapPreview: SwapPreview,
  environment: {
    symbols: ExchangeSymbol[],
    orderBooks: OrderBook[],
    atomexProtocolFees: AtomexProtocolMultiChainFees,
    accounts: Accounts,
    swaps: Swap[]
  }
]> = [
    [
      'Swap XTZ -> ETH with default options and 2 involved swaps',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(10),
        from: 'XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          price: new BigNumber('0.000948468'),
          address: 'tz101',
          actual: {
            amount: new BigNumber('10'),
            price: new BigNumber('0.000948468'),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          },
          max: {
            amount: new BigNumber('13.455627'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1054.331827747'),
          address: '0x01',
          actual: {
            amount: new BigNumber('0.00948468'),
            price: new BigNumber('1054.331827747'),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
          max: {
            amount: new BigNumber('0.012762231'),
            price: new BigNumber('1054.331827747')
          }
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.0743'),
              max: new BigNumber('0.1')
            },
            {
              name: 'maker-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('5.501128'),
              max: new BigNumber('9.414791')
            },
            {
              name: 'redeem-reward',
              currencyId: 'ETH',
              estimated: new BigNumber('0.0035'),
              max: new BigNumber('0.0035')
            }
          ],
          refund: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.0743'),
              max: new BigNumber('0.1')
            },
            {
              name: 'maker-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('5.501128'),
              max: new BigNumber('9.414791')
            }
          ]
        },
        errors: [],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
        accounts: {
          tezos: {
            tz101: {
              XTZ: new BigNumber(110)
            }
          },
          ethereum: {
            '0x01': {
              ETH: new BigNumber(0)
            }
          }
        },
        swaps
      }
    ],
    [
      'Try swap more XTZ than on balance including 2 involved swaps (XTZ -> ETH)',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(35),
        from: 'XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          price: new BigNumber('0.000948468'),
          address: 'tz101',
          actual: {
            amount: new BigNumber('35'),
            price: new BigNumber('0.000948468'),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          },
          max: {
            amount: new BigNumber('3.455627'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1054.331827747'),
          address: '0x01',
          actual: {
            amount: new BigNumber('0.03319638'),
            price: new BigNumber('1054.331827747'),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
          max: {
            amount: new BigNumber('0.003277551'),
            price: new BigNumber('1054.331827747')
          }
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.0743'),
              max: new BigNumber('0.1')
            },
            {
              name: 'maker-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('5.501128'),
              max: new BigNumber('9.414791')
            },
            {
              name: 'redeem-reward',
              currencyId: 'ETH',
              estimated: new BigNumber('0.0035'),
              max: new BigNumber('0.0035')
            }
          ],
          refund: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.0743'),
              max: new BigNumber('0.1')
            },
            {
              name: 'maker-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('5.501128'),
              max: new BigNumber('9.414791')
            }
          ]
        },
        errors: [
          {
            id: 'not-enough-funds',
            data: {
              type: 'swaps',
              currencyId: 'XTZ',
              lockedAmount: new BigNumber(87.029582),
              swapIds: [100, 89]
            }
          }
        ],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
        accounts: {
          tezos: {
            tz101: {
              XTZ: new BigNumber(100)
            }
          },
          ethereum: {
            '0x01': {
              ETH: new BigNumber(0)
            }
          }
        },
        swaps
      }
    ],
    [
      'Try swap more XTZ than on balance including 2 involved swaps (XTZ -> ETH)',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(35),
        from: 'XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          price: new BigNumber('0.000948468'),
          address: 'tz101',
          actual: {
            amount: new BigNumber('35'),
            price: new BigNumber('0.000948468'),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          },
          max: {
            amount: new BigNumber('3.455627'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1054.331827747'),
          address: '0x01',
          actual: {
            amount: new BigNumber('0.03319638'),
            price: new BigNumber('1054.331827747'),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
          max: {
            amount: new BigNumber('0.003277551'),
            price: new BigNumber('1054.331827747')
          }
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.0743'),
              max: new BigNumber('0.1')
            },
            {
              name: 'maker-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('5.501128'),
              max: new BigNumber('9.414791')
            },
            {
              name: 'redeem-reward',
              currencyId: 'ETH',
              estimated: new BigNumber('0.0035'),
              max: new BigNumber('0.0035')
            }
          ],
          refund: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.0743'),
              max: new BigNumber('0.1')
            },
            {
              name: 'maker-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('5.501128'),
              max: new BigNumber('9.414791')
            }
          ]
        },
        errors: [
          {
            id: 'not-enough-funds',
            data: {
              type: 'swaps',
              currencyId: 'XTZ',
              lockedAmount: new BigNumber(87.029582),
              swapIds: [100, 89]
            }
          }
        ],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
        accounts: {
          tezos: {
            tz101: {
              XTZ: new BigNumber(100)
            }
          },
          ethereum: {
            '0x01': {
              ETH: new BigNumber(0)
            }
          }
        },
        swaps
      }
    ],
  ];

export default swapPreviewWithoutAccountTestCases;
