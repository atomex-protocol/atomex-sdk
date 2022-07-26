const invalidTopOfBookTestCases: ReadonlyArray<readonly [
  message: string,
  response: { [key: string]: unknown }
]> = [
    [
      'Invalid symbols',
      {
        code: 400,
        message: 'Invalid symbols.'
      }
    ],
  ];

export default invalidTopOfBookTestCases;
