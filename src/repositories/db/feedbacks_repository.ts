import {DeleteResult, ObjectId, WithId} from "mongodb";
import { feedbacksCollection, postsCollection } from "../../database/runDB";
import {CommentDBModel, CommentViewModel} from "../../models/modelsComment/commentInputModel";
import {PostViewModel} from "../../models/modelsPosts/postViewModel";

function commentMapping(comment: WithId<CommentDBModel> ): CommentViewModel {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}
export const feedBacksRepository = {
    async testingDeleteAllComments(): Promise<DeleteResult> {
        return await feedbacksCollection.deleteMany({})
    },
    async searchPostIdForComments(postId: string):Promise <PostViewModel | null > {
        const postIdForComments = await postsCollection.findOne({id: postId})
        return postIdForComments? postIdForComments : null
    },
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await feedbacksCollection.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }
        return commentMapping(comment)
    },
    async addNewComment(comment: CommentDBModel): Promise <CommentViewModel> {
        const result = await feedbacksCollection.insertOne(comment)

        return {
            id: result.insertedId.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    },
}