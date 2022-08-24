export { EventEmitter, DeferredEventEmitter } from './event/index';
export { HttpClient, type RequestOptions } from './httpClient';

export type {
  PublicEventEmitter, ToEventEmitter, ToEventEmitters,
  ToDeferredEventEmitter, ToDeferredEventEmitters
} from './event/index';
export type {
  Result, SuccessResult, ErrorResult, Mutable, DeepReadonly,
  DeepRequired, DeepPartial, DeepMutable, PropsOf,
  OverloadParameters, OverloadReturnType
} from './typings/index';
