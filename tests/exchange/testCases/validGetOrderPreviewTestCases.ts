import BigNumber from 'bignumber.js';

import type { ExchangeSymbol, OrderBook, OrderPreview, OrderPreviewParameters } from '../../../src/exchange/index';

const symbols: ExchangeSymbol[] =
  [
    {
      name: 'ETH/BTC',
      baseCurrency: 'BTC',
      quoteCurrency: 'ETH',
      minimumQty: new BigNumber(0.001),
      decimals: {
        baseCurrency: 8,
        quoteCurrency: 9,
        price: 9
      }
    },
    {
      name: 'XTZ/ETH',
      baseCurrency: 'ETH',
      quoteCurrency: 'XTZ',
      minimumQty: new BigNumber(0.0001),
      decimals: {
        baseCurrency: 9,
        quoteCurrency: 6,
        price: 9
      }
    },
    {
      name: 'XTZ/USDT_XTZ',
      baseCurrency: 'USDT_XTZ',
      quoteCurrency: 'XTZ',
      minimumQty: new BigNumber(0.0001),
      decimals: {
        baseCurrency: 6,
        quoteCurrency: 6,
        price: 9
      }
    },
  ];

const orderBooks = [
  ({
    updateId: 100,
    symbol: 'XTZ/ETH',
    baseCurrency: 'ETH',
    quoteCurrency: 'XTZ',
    entries: [
      {
        side: 'Buy',
        price: new BigNumber(0.001097614),
        qtyProfile: [
          300.0
        ]
      },
      {
        side: 'Sell',
        price: new BigNumber(0.001132176),
        qtyProfile: [
          900.0
        ]
      }
    ]
  } as OrderBook),
  ({
    updateId: 200,
    symbol: 'XTZ/USDT_XTZ',
    baseCurrency: 'USDT_XTZ',
    quoteCurrency: 'XTZ',
    entries: [
      {
        side: 'Buy',
        price: new BigNumber(1.799568),
        qtyProfile: [
          100.0
        ]
      },
      {
        side: 'Sell',
        price: new BigNumber(1.841839),
        qtyProfile: [
          100.0
        ]
      }
    ]
  } as OrderBook)
] as const;

const validGetOrderPreviewTestCases: ReadonlyArray<[
  message: string,
  orderPreviewParameters: OrderPreviewParameters,
  expectedOrderPreview: OrderPreview,
  symbols: ExchangeSymbol[],
  orderBook: OrderBook
]> = [
    [
      'simple, from XTZ to ETH',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber('35.483843'),
        from: 'XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          amount: new BigNumber('35.483843'),
          price: new BigNumber('0.001097614')
        },
        to: {
          currencyId: 'ETH',
          amount: new BigNumber('0.038947563'),
          price: new BigNumber('911.067096447')
        }
      },
      symbols,
      orderBooks[0],
    ],
    [
      'simple, symbol=XTZ/ETH, side=Sell',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber('35.483843'),
        symbol: 'XTZ/ETH',
        side: 'Sell'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          amount: new BigNumber('35.483843'),
          price: new BigNumber('0.001097614')
        },
        to: {
          currencyId: 'ETH',
          amount: new BigNumber('0.038947563'),
          price: new BigNumber('911.067096447')
        }
      },
      symbols,
      orderBooks[0]
    ],
    [
      'floor amount, from XTZ to ETH',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber('57.123456789123456789'),
        from: 'XTZ',
        to: 'ETH'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          amount: new BigNumber('57.123456'),
          price: new BigNumber('0.001097614')
        },
        to: {
          currencyId: 'ETH',
          amount: new BigNumber('0.062699506'),
          price: new BigNumber('911.067096447')
        }
      },
      symbols,
      orderBooks[0]
    ],
    [
      'simple, from USDT_XTZ to XTZ',
      {
        type: 'SolidFillOrKill',
        amount: new BigNumber('100'),
        from: 'USDT_XTZ',
        to: 'XTZ'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Buy',
        symbol: 'XTZ/USDT_XTZ',
        from: {
          currencyId: 'USDT_XTZ',
          amount: new BigNumber('100'),
          price: new BigNumber('0.54293562')
        },
        to: {
          currencyId: 'XTZ',
          amount: new BigNumber('54.293562'),
          price: new BigNumber('1.841839')
        }
      },
      symbols,
      orderBooks[1]
    ]
  ];

export default validGetOrderPreviewTestCases;
