import {UserCreateModel} from "../models/modelsUsers/usersInputModel";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {ObjectId, WithId} from "mongodb";


export const jwtService = {
    async createJWT(user: WithId<UserCreateModel>): Promise<string> {
        const token = jwt.sign({userId: new ObjectId(user._id)}, settings.JWT_SECRET, {expiresIn: '1h'})
        return token
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