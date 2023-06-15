import { LikeModelClass } from "../models/mongoose/models";
import { ObjectId } from "mongodb";
import { likesInfoRepo } from "../repositories/db/likesInfo-db-repository";

export enum Status { 'None', 'Like', 'Dislike'}

export const likesOrDisCount = async( id: string | ObjectId ) => {

    if (typeof id === "string") {

        const likes = await LikeModelClass.countDocuments({
            postOrCommentId: id,
            status: "Like"
        })
        const disLikes = await LikeModelClass.countDocuments({
            postOrCommentId: id,
            status: "Dislike"
        })

        return {
            likes,
            disLikes
        }
    }

    const likes = await LikeModelClass.countDocuments({
        postOrCommentId: id.toString(),
        status: "Like"
    })
    const disLikes = await LikeModelClass.countDocuments({
        postOrCommentId: id.toString(),
        status: "Dislike"
    })
    return {
        likes,
        disLikes
    }
}

export const likesInfoCurrentUser = async( commentOrPostId: string | ObjectId, userId?: string, ) => {
    if (!userId) {
        return "None"
    }
    if (typeof commentOrPostId === "string") {
        const likeInfo = await likesInfoRepo.getLikeInfo(userId,
            commentOrPostId)
        return likeInfo ? likeInfo.status : "None"
    }

    const likeInfo = await likesInfoRepo.getLikeInfo(userId,
        commentOrPostId.toString())
    return likeInfo ? likeInfo.status : "None"
}

