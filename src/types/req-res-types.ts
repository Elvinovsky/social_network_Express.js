import {
    Request,
    Response
} from "express";
import { UserViewModel } from "../models/modelsUsersLogin/user-view";
import {
    ObjectId
} from "mongodb";


export type RequestInputBody<T> = Request<{}, {}, T>;
export type RequestParamsId<T> = Request<T>;
export type RequestParamsAndInputBody<T, B> = Request<T, {}, B>;
export type ResponseViewBody<T> = Response<T>;
export type RequestParamsAndInputQuery<T, Q> = Request<T, {}, {}, Q>;
export type RequestQuery<T> = Request<{}, {}, {}, T>;

declare global {
    namespace Express {
        export interface Request {
            user: UserViewModel | null
            userId: ObjectId
            issuedAt: number
            deviceId: string
        }
    }
}