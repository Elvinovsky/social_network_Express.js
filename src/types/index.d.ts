import { UserViewModel } from "../models/modelsUsersLogin/user-view";
import { ObjectId } from "mongodb";

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