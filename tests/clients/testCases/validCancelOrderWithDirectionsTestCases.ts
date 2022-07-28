import type { SymbolDto } from '../../../src/clients/dtos';
import type { CancelOrderRequest } from '../../../src/exchange/index';

const validCancelOrderWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [symbolDtos: SymbolDto[], request: CancelOrderRequest, expectedSymbol: string, expectedFilterValue: string]
]> = [
    [
      'Buy case',
      [
        [{
          name: 'XTZ/ETH',
          minimumQty: 1
        }],
        {
          orderId: 1,
          from: 'ETH',
          to: 'XTZ'
        },
        'XTZ/ETH',
        'Buy'
      ]
    ],
    [
      'Sell case',
      [
        [{
          name: 'XTZ/ETH',
          minimumQty: 1
        }],
        {
          orderId: 1,
          from: 'XTZ',
          to: 'ETH'
        },
        'XTZ/ETH',
        'Sell'
      ]
    ]
  ];

export default validCancelOrderWithDirectionsTestCases;
