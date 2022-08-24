export type PropsOf<T> = {
  [P in keyof T]: T[P]
};
