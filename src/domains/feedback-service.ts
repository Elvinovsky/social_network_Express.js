import {CommentDBModel, CommentViewModel} from "../models/modelsComment/commentInputModel";
import {feedBacksRepository} from "../repositories/db/feedbacks_repository";
import {PostViewModel} from "../models/modelsPosts/postViewModel";
import {usersRepository} from "../repositories/db/users-db-repository";

export const feedbacksService = {
    async searchPostIdForComments(postId: string):Promise <PostViewModel | null > {
        return await feedBacksRepository.searchPostIdForComments(postId)
    },
    async createComment(postId: string, userId: string, content: string,): Promise<CommentViewModel> {
        const outputUserLogin = await usersRepository.findUserLoginForComment(userId)

        const newComment: CommentDBModel = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: outputUserLogin!
            },
            createdAt: new Date().toISOString()
        }
        return await feedBacksRepository.addNewComment(newComment)
    },
    async getComment(id: string): Promise<CommentViewModel | null> {
        return await feedBacksRepository.getCommentById(id)
    },

}