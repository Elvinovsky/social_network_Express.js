import {
    DeleteResult,
    ObjectId,
    WithId
} from "mongodb";
import { CommentViewModel } from "../../models/modelsComment/comment-view";
import { CommentDBModel } from "../../models/modelsComment/comment-input";
import { commentMapping } from "../../functions/commentsMapping";
import { PostDBModel } from "../../models/modelsPosts/post-input";
import {
    CommentModelClass,
    LikeModelClass,
    PostModelClass
} from "../../models/mongoose/models";
import { LikeDBInfo } from "../../models/modelsLike/like-input";

export class FeedbacksDbRepository {
    async testingDeleteAllComments (): Promise<DeleteResult> {
        return await CommentModelClass.deleteMany({})
    }

    async searchPostIdForComments ( postId: string ): Promise<PostDBModel | null> {
        return await PostModelClass.findOne({ _id: new ObjectId(postId) })
    }

    async getCommentById ( id: string, userId?: string ): Promise<CommentViewModel | null> {
        const comment = await CommentModelClass.findOne({ _id: new ObjectId(id) })
        if (!comment) {
            return null
        }
        return commentMapping(comment,
            userId)
    }

    async addNewComment ( comment: CommentDBModel ): Promise<CommentViewModel> {
        const result: WithId<CommentDBModel> = await CommentModelClass.create(comment)
        return commentMapping(result)
    }

    async updateCommentById ( id: string, content: string ): Promise<boolean> {
        const result = await CommentModelClass.updateOne({ _id: new ObjectId(id) },
            { $set: { content } })
        return result.matchedCount === 1
    }

    async deleteComment ( id: string ): Promise<boolean> {
        const resultDeleted = await CommentModelClass.deleteOne({ _id: new ObjectId(id) })
        return resultDeleted.deletedCount === 1
    }

    async changeLikeTotalCounts ( id: string, likesCount: number, dislikesCount: number ) { // todo to realize
        const result = await CommentModelClass.updateOne({ _id: new ObjectId(id) },
            { $set: { "likeInfo.likesCount": likesCount } })
    }
}

