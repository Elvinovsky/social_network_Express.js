import {
    CommentModelClass,
    LikeModelClass
} from "../../models/mongoose/models";
import { ObjectId } from "mongodb";

export const likesInfoRepo = {

    async testDeleteDb () {
        await LikeModelClass.deleteMany({})
    },
    async getLikeInfo ( userId: string, postOrCommentId: string ) {

        return LikeModelClass.findOne({
            userId: userId,
            postOrCommentId: postOrCommentId
        })
    },
    async updateLikeInfo (userId: string, postOrCommentId: string, statusType: string){

        const result = await LikeModelClass.updateOne({
                userId: userId,
                postOrCommentId: postOrCommentId
            },
            { $set: { status: statusType } })
        return result.matchedCount === 1
    },
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
    },
    async changeLikeTotalCounts ( id: string, likesCount: number, dislikesCount: number ) { // todo to realize
        const result = await CommentModelClass.updateOne({ _id: new ObjectId(id) },
            { $set: { "likeInfo.likesCount": likesCount } })
    }
}