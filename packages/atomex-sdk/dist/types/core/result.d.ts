export interface SuccessResult<T = unknown> {
    success: true;
    data: T;
}
export interface ErrorResult<ErrorType extends Error | string = string> {
    success: false;
    error: ErrorType;
}
export declare type Result<T = unknown, E extends Error | string = string> = SuccessResult<T> | ErrorResult<E>;
