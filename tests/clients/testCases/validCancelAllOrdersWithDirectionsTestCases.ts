import { SymbolDto } from '../../../src/clients/dtos';
import { CancelAllSide } from '../../../src/common/index';
import { CancelAllOrdersRequest } from '../../../src/exchange/index';

const validCancelAllOrdersWithDirectionsTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [symbolDto: SymbolDto[], request: CancelAllOrdersRequest, expectedSymbol: string, expectedFilterValue: CancelAllSide]
]> = [
    [
      'Buy case',
      [
        [{
          name: 'XTZ/ETH',
          minimumQty: 1
        }],
        {
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
          from: 'XTZ',
          to: 'ETH'
        },
        'XTZ/ETH',
        'Sell'
      ]
    ],
    [
      'All sides case',
      [
        [{
          name: 'XTZ/ETH',
          minimumQty: 1
        }],
        {
          from: 'XTZ',
          to: 'ETH',
          cancelAllDirections: true
        },
        'XTZ/ETH',
        'All'
      ]
    ]
  ];

export default validCancelAllOrdersWithDirectionsTestCases;
