import { WithId } from "mongodb";
import { CommentViewModel } from "../models/modelsComment/comment-view";
import { CommentDBModel } from "../models/modelsComment/comment-input";
import { LikeModelClass } from "../models/mongoose/models";

export const commentsMapping = ( array: Array<WithId<CommentDBModel>>, userId?: string ): Promise<CommentViewModel[]> => {

    return Promise
        .all( array.map( async( el ) => {

        let likeInfo = null;

        if (userId) {
            likeInfo = await LikeModelClass.findOne({
                userId: userId,
                postOrCommentId: el._id.toString(),
            })

            if (likeInfo) {
                likeInfo = likeInfo.status
            }
        }

        return {
            id: el._id.toString(),
            content: el.content,
            commentatorInfo: {
                userId: el.commentatorInfo.userId,
                userLogin: el.commentatorInfo.userLogin
            },
            likesInfo: {
                likesCount: el.likesInfo.likesCount,
                dislikesCount: el.likesInfo.dislikesCount,
                myStatus: likeInfo || "None"
            },
            createdAt: el.createdAt
        }
    })
    )
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