import {
    Request,
    Response
} from "express";

export type RequestInputBody<T> = Request<{}, {}, T>;
export type RequestParamsId<T> = Request<T>;
export type RequestParamsAndInputBody<T, B> = Request<T, {}, B>;
export type ResponseViewBody<T> = Response<T>;
export type RequestParamsAndInputQuery<T, Q> = Request<T, {}, {}, Q>;
export type RequestQuery<T> = Request<{}, {}, {}, T>;

