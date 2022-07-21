import { CreatedOrderDto, } from '../../../src/clients/dtos';

const validAddOrderTestCases: ReadonlyArray<readonly [
  message: string,
  testValue: readonly [dto: CreatedOrderDto, orderId: number]
]> = [
    [
      'Simple order',
      [
        {
          orderId: 123
        },
        123
      ]
    ]
  ];

export default validAddOrderTestCases;
