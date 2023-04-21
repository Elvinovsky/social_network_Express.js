import {
    DeleteResult,
    InsertOneResult,
    WithId
} from "mongodb";
import { tokenCollection } from "../../database/runDB";
import { UsedTokenByUser } from "../../models/modelsUsersLogin/login-input";

export const jwtDbRepository = {
    async testingDeleteAllUsers (): Promise<DeleteResult> {
        return await tokenCollection.deleteMany({})
    },
    async findTokenByUserId ( userId: string ): Promise<WithId<UsedTokenByUser> | null> {
        return await tokenCollection.findOne({ userId: userId })
    },
    async addTokenRepo ( usedToken:UsedTokenByUser ):  Promise<InsertOneResult<UsedTokenByUser>>{
        return await tokenCollection.insertOne(usedToken)
    },
    async rootedToken ( token:string ):  Promise<boolean>{
        const result = await tokenCollection.updateOne({refreshToken: token}, {$set: {isValid: false}})
        return result.matchedCount === 1
    }

}