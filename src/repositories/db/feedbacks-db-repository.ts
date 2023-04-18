import {DeleteResult, ObjectId} from "mongodb";
import {feedbacksCollection, postsCollection} from "../../database/runDB";
import {CommentViewModel} from "../../models/modelsComment/comment-view";
import {CommentDBModel} from "../../models/modelsComment/comment-input";
import {commentMapping} from "../../functions/commentsMapping";
import {PostDBModel} from "../../models/modelsPosts/post-input";

export const feedBacksRepository = {
    async testingDeleteAllComments(): Promise<DeleteResult> {
        return await feedbacksCollection.deleteMany({})
    },
    async searchPostIdForComments(postId: string):Promise <PostDBModel | null > {
        return await postsCollection.findOne({_id: new ObjectId(postId)})
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
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await feedbacksCollection.updateOne({_id: new ObjectId(id)}, {$set: {content}})
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        const resultDeleted = await feedbacksCollection.deleteOne({_id: new ObjectId(id)})
        return resultDeleted.deletedCount === 1
    },
}