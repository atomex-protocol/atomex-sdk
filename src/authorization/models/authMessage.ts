export type AuthMessage =
  | ((parameters: { readonly address: string; readonly blockchain?: string; }) => string)
  | string;
