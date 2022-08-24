import BigNumber from 'bignumber.js';

import type { SwapPreview, SwapPreviewParameters } from '../../../src/atomex/models';
import type { ExchangeSymbol, OrderBook } from '../../../src/exchange';
import { AtomexProtocolV1Fees, validAtomexProtocolV1Fees } from './atomexProtocolFees';
import { validExchangeSymbols } from './exchangeSymbols';
import { validOrderBooks } from './orderBooks';

const swapPreviewWithoutAccountTestCases: ReadonlyArray<[
  message: string,
  swapPreviewParameters: SwapPreviewParameters,
  expectedSwapPreview: SwapPreview,
  environment: {
    symbols: ExchangeSymbol[],
    orderBook: OrderBook,
    atomexProtocolFees: AtomexProtocolV1Fees
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
        orderBook: validOrderBooks['XTZ/ETH'][0],
        atomexProtocolFees: validAtomexProtocolV1Fees[0],
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
              estimated: new BigNumber('0.002370471'),
              max: new BigNumber('0.003094846')
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
              estimated: new BigNumber('0.002370471'),
              max: new BigNumber('0.003094846')
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
        orderBook: validOrderBooks['XTZ/ETH'][0],
        atomexProtocolFees: validAtomexProtocolV1Fees[0],
      }
    ]
  ];

export default swapPreviewWithoutAccountTestCases;
