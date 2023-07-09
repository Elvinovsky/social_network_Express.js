import {
    LikeModelClass
} from "../../models/mongoose/models";
import { injectable } from "inversify";

@injectable()
export class LikesInfoRepo {

    async testDeleteDb () {
        await LikeModelClass.deleteMany({})
    }
    async getLikeInfo ( userId: string, postOrCommentId: string ) {

        return LikeModelClass.findOne({
            userId: userId,
            postOrCommentId: postOrCommentId
        })
    }
    async updateLikeInfo (userId: string, postOrCommentId: string, statusType: string){

        const result = await LikeModelClass.updateOne({
                userId: userId,
                postOrCommentId: postOrCommentId
            },
            { $set: { status: statusType } })
        return result.matchedCount === 1
    }
    async addLikeInfo(userId: string, userLogin: string, postOrCommentId: string, statusType: string){

        const newLikeInfo = new LikeModelClass({
            status: statusType,
            userId,
            userLogin,
            postOrCommentId: postOrCommentId,
            createdAt: new Date()
        })

        await newLikeInfo.save()
        return !!newLikeInfo
    }
}