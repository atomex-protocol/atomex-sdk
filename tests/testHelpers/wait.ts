export const wait = (timeoutMs: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, timeoutMs);
  });
};
