import { WithId } from "mongodb";
import { CommentViewModel } from "../models/modelsComment/comment-view";
import { CommentDBModel } from "../models/modelsComment/comment-input";
import {
    likesInfoCurrentUser,
    likesOrDisCount
} from "../helpers/like-helpers";

export const commentsMapping = ( array: Array<WithId<CommentDBModel>>, userId?: string ): Promise<CommentViewModel[]> => {

    return Promise
        .all(array.map(async( el ) => {

            const status = await likesInfoCurrentUser(el._id, userId)

            const countsLikeAndDis = await likesOrDisCount(el._id)

            return {
                id: el._id.toString(),
                content: el.content,
                commentatorInfo: {
                    userId: el.commentatorInfo.userId,
                    userLogin: el.commentatorInfo.userLogin
                },
                likesInfo: {
                    likesCount: countsLikeAndDis.likes,
                    dislikesCount: countsLikeAndDis.disLikes,
                    myStatus: status
                },
                createdAt: el.createdAt
            }
        }))
}

export const commentMapping = ( comment: WithId<CommentDBModel> ): CommentViewModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: comment.likesInfo.myStatus || "None"
        },
        createdAt: comment.createdAt
    }
}