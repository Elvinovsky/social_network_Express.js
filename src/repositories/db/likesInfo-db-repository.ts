import { LikeModelClass } from "../../models/mongoose/models";

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


}