export const resetAllMocks = <T>(value: T) => {
  for (const propertyValue of Object.values(value)) {
    if (typeof propertyValue['mockReset'] === 'function') {
      propertyValue.mockReset();
    }
  }
};
