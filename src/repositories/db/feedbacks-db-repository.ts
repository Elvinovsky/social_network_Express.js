import {DeleteResult, ObjectId} from "mongodb";
import {CommentViewModel} from "../../models/modelsComment/comment-view";
import {CommentDBModel} from "../../models/modelsComment/comment-input";
import {commentMapping} from "../../functions/commentsMapping";
import {PostDBModel} from "../../models/modelsPosts/post-input";
import {
    CommentModelClass,
    PostModelClass
} from "../../models/mongoose/models";

export const feedBacksRepository = {
    async testingDeleteAllComments(): Promise<DeleteResult> {
        return await CommentModelClass.deleteMany({})
    },
    async searchPostIdForComments(postId: string):Promise <PostDBModel | null > {
        return await PostModelClass.findOne({_id: new ObjectId(postId)})
    },
    async getCommentById(id: string): Promise<CommentViewModel | null> {
        const comment = await CommentModelClass.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }
        return commentMapping(comment)
    },
    async addNewComment(comment: CommentDBModel): Promise <CommentViewModel> {
        const result = await CommentModelClass.create(comment)

        return {
            id: result._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await CommentModelClass.updateOne({_id: new ObjectId(id)}, {$set: {content}})
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        const resultDeleted = await CommentModelClass.deleteOne({_id: new ObjectId(id)})
        return resultDeleted.deletedCount === 1
    },
}