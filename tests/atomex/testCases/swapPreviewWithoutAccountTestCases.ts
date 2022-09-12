import BigNumber from 'bignumber.js';

import type { SwapPreview, SwapPreviewParameters } from '../../../src/atomex/models';
import type { ExchangeSymbol, OrderBook } from '../../../src/exchange';
import { AtomexProtocolMultiChainFees, validAtomexProtocolMultiChainFees } from './atomexProtocolFees';
import { validExchangeSymbols } from './exchangeSymbols';
import { validOrderBooks } from './orderBooks';

const swapPreviewWithoutAccountTestCases: ReadonlyArray<[
  message: string,
  swapPreviewParameters: SwapPreviewParameters,
  expectedSwapPreview: SwapPreview,
  environment: {
    symbols: ExchangeSymbol[],
    orderBooks: OrderBook[],
    atomexProtocolFees: AtomexProtocolMultiChainFees
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
          price: new BigNumber('0.000948468'),
          actual: {
            amount: new BigNumber('35'),
            price: new BigNumber('0.000948468'),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1054.331827747'),
          actual: {
            amount: new BigNumber('0.03319638'),
            price: new BigNumber('1054.331827747'),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
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
      }
    ],
    [
      'Swap ETH -> XTZ with default options',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(0.51717),
        from: 'ETH',
        to: 'XTZ'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Buy',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'ETH',
          price: new BigNumber('1022.767834769'),
          actual: {
            amount: new BigNumber('0.51717'),
            price: new BigNumber('1022.767834769'),
          },
          available: {
            amount: new BigNumber('0.8799651'),
            price: new BigNumber('1022.767834769')
          },
        },
        to: {
          currencyId: 'XTZ',
          price: new BigNumber('0.000977739'),
          actual: {
            amount: new BigNumber('528.944841'),
            price: new BigNumber('0.000977739'),
          },
          available: {
            amount: new BigNumber('900'),
            price: new BigNumber('0.000977739')
          }
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.00525'),
              max: new BigNumber('0.009')
            },
            {
              name: 'maker-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.002371559'),
              max: new BigNumber('0.003096311')
            },
            {
              name: 'redeem-reward',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.11'),
              max: new BigNumber('0.11')
            }
          ],
          refund: [
            {
              name: 'payment-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.00525'),
              max: new BigNumber('0.009')
            },
            {
              name: 'maker-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.002371559'),
              max: new BigNumber('0.003096311')
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
      }
    ],
    [
      'Swap USDT_XTZ -> ETH with default options',
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
          price: new BigNumber('0.000613034'),
          actual: {
            amount: new BigNumber('1217.234'),
            price: new BigNumber('0.000613034'),
          },
          available: {
            amount: new BigNumber('1631.22858'),
            price: new BigNumber('0.000613034')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1631.22858'),
          actual: {
            amount: new BigNumber('0.746206886'),
            price: new BigNumber('1631.22858'),
          },
          available: {
            amount: new BigNumber('1'),
            price: new BigNumber('1631.22858')
          },
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
              estimated: new BigNumber('8.615812'),
              max: new BigNumber('14.712051')
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
              estimated: new BigNumber('8.615812'),
              max: new BigNumber('14.712051')
            }
          ]
        },
        errors: [],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [
          validOrderBooks['ETH/USDT_XTZ'][0],
          validOrderBooks['XTZ/USDT_XTZ'][0]
        ],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
      }
    ],
    [
      'Swap ETH -> XTZ_USDT with default options',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(0.425755),
        from: 'ETH',
        to: 'USDT_XTZ'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'ETH/USDT_XTZ',
        from: {
          currencyId: 'ETH',
          price: new BigNumber('1603.468672'),
          actual: {
            amount: new BigNumber('0.425755'),
            price: new BigNumber('1603.468672'),
          },
          available: {
            amount: new BigNumber('1'),
            price: new BigNumber('1603.468672')
          }
        },
        to: {
          currencyId: 'USDT_XTZ',
          price: new BigNumber('0.000623647'),
          actual: {
            amount: new BigNumber('682.684804'),
            price: new BigNumber('0.000623647'),
          },
          available: {
            amount: new BigNumber('1603.468672'),
            price: new BigNumber('0.000623647')
          },
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.00525'),
              max: new BigNumber('0.009')
            },
            {
              name: 'maker-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.002400452'),
              max: new BigNumber('0.003125204')
            },
            {
              name: 'redeem-reward',
              currencyId: 'USDT_XTZ',
              estimated: new BigNumber('0.217'),
              max: new BigNumber('0.217')
            }
          ],
          refund: [
            {
              name: 'payment-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.00525'),
              max: new BigNumber('0.009')
            },
            {
              name: 'maker-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.002400452'),
              max: new BigNumber('0.003125204')
            }
          ]
        },
        errors: [],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [
          validOrderBooks['ETH/USDT_XTZ'][0],
          validOrderBooks['XTZ/ETH'][0],
        ],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
      }
    ],
    [
      'Swap XTZ -> ETH with disabled watch tower mode',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(123),
        from: 'XTZ',
        to: 'ETH',
        watchTower: {
          redeemEnabled: false,
          refundEnabled: false
        }
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          price: new BigNumber('0.000948468'),
          actual: {
            amount: new BigNumber('123'),
            price: new BigNumber('0.000948468'),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1054.331827747'),
          actual: {
            amount: new BigNumber('0.116661564'),
            price: new BigNumber('1054.331827747'),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
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
              estimated: new BigNumber('5.501128'),
              max: new BigNumber('9.414791')
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
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
      }
    ],
    [
      'Swap ETH -> XTZ_USDT with disabled watch tower mode',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(0.37),
        from: 'ETH',
        to: 'USDT_XTZ',
        watchTower: {
          redeemEnabled: false,
          refundEnabled: false
        }
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'ETH/USDT_XTZ',
        from: {
          currencyId: 'ETH',
          price: new BigNumber('1603.468672'),
          actual: {
            amount: new BigNumber('0.37'),
            price: new BigNumber('1603.468672'),
          },
          available: {
            amount: new BigNumber('1'),
            price: new BigNumber('1603.468672')
          }
        },
        to: {
          currencyId: 'USDT_XTZ',
          price: new BigNumber('0.000623647'),
          actual: {
            amount: new BigNumber('593.283408'),
            price: new BigNumber('0.000623647'),
          },
          available: {
            amount: new BigNumber('1603.468672'),
            price: new BigNumber('0.000623647')
          },
        },
        fees: {
          success: [
            {
              name: 'payment-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.00525'),
              max: new BigNumber('0.009')
            },
            {
              name: 'maker-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.002400452'),
              max: new BigNumber('0.003125204')
            },
            {
              name: 'redeem-fee',
              currencyId: 'XTZ',
              estimated: new BigNumber('0.08'),
              max: new BigNumber('0.1')
            }
          ],
          refund: [
            {
              name: 'payment-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.00525'),
              max: new BigNumber('0.009')
            },
            {
              name: 'maker-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.002400452'),
              max: new BigNumber('0.003125204')
            },
            {
              name: 'refund-fee',
              currencyId: 'ETH',
              estimated: new BigNumber('0.0017'),
              max: new BigNumber('0.002')
            }
          ]
        },
        errors: [],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [
          validOrderBooks['ETH/USDT_XTZ'][0],
          validOrderBooks['XTZ/ETH'][0],
        ],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
      }
    ],
    [
      'Swap XTZ -> ETH with more amount than liquidity',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(301.12345678),
        from: 'XTZ',
        to: 'ETH',
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          price: new BigNumber('0.000948468'),
          actual: {
            amount: new BigNumber('301.12345678'),
            price: new BigNumber(0),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1054.331827747'),
          actual: {
            amount: new BigNumber(0),
            price: new BigNumber(0),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
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
        errors: [{
          id: 'not-enough-liquidity'
        }],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
      }
    ],
    [
      'Swap XTZ -> ETH with more amount than liquidity',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber(1),
        from: 'XTZ',
        to: 'ETH',
        isFromAmount: false
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          price: new BigNumber('0.000948468'),
          actual: {
            amount: new BigNumber(0),
            price: new BigNumber(0),
          },
          available: {
            amount: new BigNumber('300'),
            price: new BigNumber('0.000948468')
          }
        },
        to: {
          currencyId: 'ETH',
          price: new BigNumber('1054.331827747'),
          actual: {
            amount: new BigNumber(1),
            price: new BigNumber(0),
          },
          available: {
            amount: new BigNumber('0.2845404'),
            price: new BigNumber('1054.331827747')
          },
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
        errors: [{
          id: 'not-enough-liquidity'
        }],
        warnings: []
      },
      {
        symbols: validExchangeSymbols,
        orderBooks: [validOrderBooks['XTZ/ETH'][0]],
        atomexProtocolFees: validAtomexProtocolMultiChainFees[0],
      }
    ],
  ];

export default swapPreviewWithoutAccountTestCases;
