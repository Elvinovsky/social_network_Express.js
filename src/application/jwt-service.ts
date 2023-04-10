import {UserCreateModel} from "../models/modelsUsers/usersInputModel";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {ObjectId, WithId} from "mongodb";
import {LoginSuccessViewModel} from "../models/modelsComment/commentInputModel";


export const jwtService = {
    async createJWT(user: WithId<UserCreateModel>): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userId: new ObjectId(user._id)}, settings.JWT_SECRET, {expiresIn: '24h'})
        return {
            accessToken: token
        }
    },
    async getUserIdByToken (token: string) {
       try {
           const result: any = jwt.verify(token, settings.JWT_SECRET) // todo any
           return new ObjectId(result.userId).toString()
       }
       catch (error) {
           return null;
       }
    }
}