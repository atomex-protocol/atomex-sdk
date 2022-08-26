import BigNumber from 'bignumber.js';

import type { SwapPreview, SwapPreviewParameters } from '../../../src/atomex/models';
import type { ExchangeSymbol, OrderBook } from '../../../src/exchange';
import type { Accounts } from './accounts';
import { AtomexProtocolV1Fees, validAtomexProtocolV1Fees } from './atomexProtocolFees';
import { validExchangeSymbols } from './exchangeSymbols';
import { validOrderBooks } from './orderBooks';

const swapPreviewWithoutAccountTestCases: ReadonlyArray<[
  message: string,
  swapPreviewParameters: SwapPreviewParameters,
  expectedSwapPreview: SwapPreview,
  environment: {
    symbols: ExchangeSymbol[],
    orderBooks: OrderBook[],
    atomexProtocolFees: AtomexProtocolV1Fees,
    accounts: Accounts
  }
]> = [
    [
      'Swap XTZ -> ETH with default options',
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
            amount: new BigNumber('90.58509'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
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
            amount: new BigNumber('0.085917059'),
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
              estimated: new BigNumber('5.419531'),
              max: new BigNumber('9.27491')
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
              estimated: new BigNumber('5.419531'),
              max: new BigNumber('9.27491')
            },
            {
              name: 'refund-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.03'),
              max: new BigNumber('0.04')
            }
          ]
        },
        errors: [],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolV1Fees[0],
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
        }
      }
    ],
    [
      'Swap XTZ -> ETH with disabled watch tower and with zero ETH balance',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(35),
        from: 'XTZ',
        to: 'ETH',
        useWatchTower: false
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
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
            amount: new BigNumber('90.58509'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
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
            amount: new BigNumber('0.085917059'),
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
              estimated: new BigNumber('5.419531'),
              max: new BigNumber('9.27491')
            },
            {
              name: 'redeem-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.0023'),
              max: new BigNumber('0.003')
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
              estimated: new BigNumber('5.419531'),
              max: new BigNumber('9.27491')
            },
            {
              name: 'refund-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.03'),
              max: new BigNumber('0.04')
            }
          ]
        },
        errors: [
          {
            id: 'not-enough-funds-network-fee',
            data: {
              requiredAmount: new BigNumber('0.003')
            }
          }
        ],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolV1Fees[0],
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
        }
      }
    ],
    [
      'Swap XTZ -> ETH with small balance (not enough to pay payment fee and maker fee)',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(3),
        from: 'XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          address: 'tz101',
          actual: {
            amount: new BigNumber('3'),
            price: new BigNumber('0.000948468'),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          },
          max: undefined
        },
        to: {
          currencyId: 'ETH',
          address: '0x01',
          actual: {
            amount: new BigNumber('0.002845404'),
            price: new BigNumber('1054.331827747'),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
          max: undefined
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
              estimated: new BigNumber('5.419531'),
              max: new BigNumber('9.27491')
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
              estimated: new BigNumber('5.419531'),
              max: new BigNumber('9.27491')
            },
            {
              name: 'refund-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.03'),
              max: new BigNumber('0.04')
            }
          ]
        },
        errors: [
          {
            id: 'not-enough-funds-network-fee',
            data: {
              requiredAmount: new BigNumber('9.41491')
            }
          },
          {
            id: 'not-enough-funds',
          },
        ],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolV1Fees[0],
        accounts: {
          tezos: {
            tz101: {
              XTZ: new BigNumber(9)
            }
          },
          ethereum: {
            '0x01': {
              ETH: new BigNumber(0)
            }
          }
        }
      }
    ],
    [
      'Swap USDT_XTZ -> ETH with small XTZ balance (not enough to pay payment fee and maker fee)',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(1217.234),
        from: 'USDT_XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Buy',
        symbol: 'ETH/USDT_XTZ',
        from: {
          currencyId: 'USDT_XTZ',
          address: 'tz101',
          actual: {
            amount: new BigNumber('1217.234'),
            price: new BigNumber('0.000613034'),
          },
          available: {
            amount: new BigNumber('1631.22858'),
            price: new BigNumber('0.000613034')
          },
          max: {
            amount: new BigNumber('1631.22858'),
            price: new BigNumber('0.000613034')
          }
        },
        to: {
          currencyId: 'ETH',
          address: '0x01',
          actual: {
            amount: new BigNumber('0.746206886'),
            price: new BigNumber('1631.22858'),
          },
          available: {
            amount: new BigNumber('1'),
            price: new BigNumber('1631.22858')
          },
          max: {
            amount: new BigNumber('1'),
            price: new BigNumber('1631.22858')
          }
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.1043'),
              max: new BigNumber('0.13')
            },
            {
              name: 'maker-fee',
              currencyId: 'USDT_XTZ',
              estimated: new BigNumber('8.541664'),
              max: new BigNumber('14.585536')
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
              estimated: new BigNumber('0.1043'),
              max: new BigNumber('0.13')
            },
            {
              name: 'maker-fee',
              currencyId: 'USDT_XTZ',
              estimated: new BigNumber('8.541664'),
              max: new BigNumber('14.585536')
            },
            {
              name: 'refund-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.06'),
              max: new BigNumber('0.07')
            }
          ]
        },
        errors: [
          {
            id: 'not-enough-funds-network-fee',
            data: { requiredAmount: new BigNumber(0.2) }
          }
        ],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [
          validOrderBooks['ETH/USDT_XTZ'][0],
          validOrderBooks['XTZ/USDT_XTZ'][0]
        ],
        atomexProtocolFees: validAtomexProtocolV1Fees[0],
        accounts: {
          tezos: {
            tz101: {
              XTZ: new BigNumber(0),
              USDT_XTZ: new BigNumber(2000)
            }
          },
          ethereum: {
            '0x01': {
              ETH: new BigNumber(0)
            }
          }
        }
      }
    ],
    [
      'Try swap more USDT_XTZ than on balance (USDT_XTZ -> ETH)',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(1217.234),
        from: 'USDT_XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Buy',
        symbol: 'ETH/USDT_XTZ',
        from: {
          currencyId: 'USDT_XTZ',
          address: 'tz101',
          actual: {
            amount: new BigNumber('1217.234'),
            price: new BigNumber('0.000613034'),
          },
          available: {
            amount: new BigNumber('1631.22858'),
            price: new BigNumber('0.000613034')
          },
          max: {
            amount: new BigNumber('1000'),
            price: new BigNumber('0.000613034')
          }
        },
        to: {
          currencyId: 'ETH',
          address: '0x01',
          actual: {
            amount: new BigNumber('0.746206886'),
            price: new BigNumber('1631.22858'),
          },
          available: {
            amount: new BigNumber('1'),
            price: new BigNumber('1631.22858')
          },
          max: {
            amount: new BigNumber('0.613034869'),
            price: new BigNumber('1631.22858')
          }
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.1043'),
              max: new BigNumber('0.13')
            },
            {
              name: 'maker-fee',
              currencyId: 'USDT_XTZ',
              estimated: new BigNumber('8.541664'),
              max: new BigNumber('14.585536')
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
              estimated: new BigNumber('0.1043'),
              max: new BigNumber('0.13')
            },
            {
              name: 'maker-fee',
              currencyId: 'USDT_XTZ',
              estimated: new BigNumber('8.541664'),
              max: new BigNumber('14.585536')
            },
            {
              name: 'refund-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.06'),
              max: new BigNumber('0.07')
            }
          ]
        },
        errors: [
          {
            id: 'not-enough-funds',
          }
        ],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [
          validOrderBooks['ETH/USDT_XTZ'][0],
          validOrderBooks['XTZ/USDT_XTZ'][0]
        ],
        atomexProtocolFees: validAtomexProtocolV1Fees[0],
        accounts: {
          tezos: {
            tz101: {
              XTZ: new BigNumber(10),
              USDT_XTZ: new BigNumber(1000)
            }
          },
          ethereum: {
            '0x01': {
              ETH: new BigNumber(0)
            }
          }
        }
      }
    ],
  ];

export default swapPreviewWithoutAccountTestCases;
