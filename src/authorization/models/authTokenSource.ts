export enum AuthTokenSource {
  Local = 1 << 0,
  Remote = 1 << 1,

  All = Local | Remote
}
