import {Request, Response} from "express";

export type RequestInputBody<T> = Request<{},{},T>;
export type RequestParamsId<T> = Request<T>;
export type RequestParamsAndInputBody<T,B> = Request<T,{},B>;
export type ResponseViewBody<T> = Response<T>;
