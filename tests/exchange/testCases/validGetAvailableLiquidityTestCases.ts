import BigNumber from 'bignumber.js';

import type { ExchangeSymbol, OrderBook, SymbolLiquidity, SymbolLiquidityParameters } from '../../../src/exchange/index';

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

const validGetAvailableLiquidityTestCases: ReadonlyArray<[
  message: string,
  orderPreviewParameters: SymbolLiquidityParameters,
  expectedOrderPreview: SymbolLiquidity,
  symbols: ExchangeSymbol[],
  orderBook: OrderBook
]> = [
    [
      'simple, from ETH to XTZ',
      {
        type: 'SolidFillOrKill',
        from: 'ETH',
        to: 'XTZ',
      },
      {
        type: 'SolidFillOrKill',
        side: 'Buy',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'ETH',
          amount: new BigNumber('1.0189584'),
          price: new BigNumber('883.254900298')
        },
        to: {
          currencyId: 'XTZ',
          amount: new BigNumber('900.0'),
          price: new BigNumber('0.001132176')
        }
      },
      symbols,
      orderBooks[0],
    ],
    [
      'simple, symbol=XTZ/ETH, side=Buy',
      {
        type: 'SolidFillOrKill',
        symbol: 'XTZ/ETH',
        side: 'Buy'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Buy',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'ETH',
          amount: new BigNumber('1.0189584'),
          price: new BigNumber('883.254900298')
        },
        to: {
          currencyId: 'XTZ',
          amount: new BigNumber('900.0'),
          price: new BigNumber('0.001132176')
        }
      },
      symbols,
      orderBooks[0]
    ],
    [
      'simple, from XTZ to ETH',
      {
        type: 'SolidFillOrKill',
        from: 'XTZ',
        to: 'ETH',
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          amount: new BigNumber('300.0'),
          price: new BigNumber('0.001097614')
        },
        to: {
          currencyId: 'ETH',
          amount: new BigNumber('0.3292842'),
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
        symbol: 'XTZ/ETH',
        side: 'Sell'
      },
      {
        type: 'SolidFillOrKill',
        side: 'Sell',
        symbol: 'XTZ/ETH',
        from: {
          currencyId: 'XTZ',
          amount: new BigNumber('300.0'),
          price: new BigNumber('0.001097614')
        },
        to: {
          currencyId: 'ETH',
          amount: new BigNumber('0.3292842'),
          price: new BigNumber('911.067096447')
        }
      },
      symbols,
      orderBooks[0],
    ],
  ];

export default validGetAvailableLiquidityTestCases;
