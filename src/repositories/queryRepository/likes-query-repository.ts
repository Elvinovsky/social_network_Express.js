import { ObjectId } from "mongodb";
import { LikeDBInfo } from "../../models/modelsLike/like-input";
import { LikeModelClass } from "../../models/mongoose/models";
import { likesInfoRepo } from "../db/likesInfo-db-repository";
import { LikeInfoView } from "../../models/modelsLike/like-view";


export class LikesQueryRepo {
    async getLikesByPostId ( postId: ObjectId ): Promise<LikeDBInfo[]> {
        return LikeModelClass.find({
            postOrCommentId: postId.toString(),
            status: "Like"
        })
    }

    async getLikeStatusCurrentUser ( commentOrPostId: string | ObjectId, userId ?: string, ): Promise<string> {
        if (!userId) {
            return "None"
        }
        if (typeof commentOrPostId === "string") {
            const likeInfo: LikeDBInfo | null = await likesInfoRepo.getLikeInfo(userId,
                commentOrPostId)
            return likeInfo ? likeInfo.status : "None"
        }

        const likeInfo: LikeDBInfo | null = await likesInfoRepo.getLikeInfo(userId,
            commentOrPostId.toString())
        return likeInfo ? likeInfo.status : "None"
    }

    async getLastLikes ( id: ObjectId ): Promise<LikeInfoView[]> {

        const likesArr = await this.getLikesByPostId(id)

        return Promise
            .all(likesArr.sort(function ( a, b ) {
            return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
        })
                                   .reverse()
                                   .map(async lastLikes => {
                                       return {
                                           addedAt: lastLikes.createdAt.toISOString(),
                                           userId: lastLikes.userId,
                                           login: lastLikes.userLogin
                                       }
                                   })
                                   .slice(0,
                                       3))
    }
}