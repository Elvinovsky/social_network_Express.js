import {CommentDBModel, CommentViewModel} from "../models/modelsComment/commentInputModel";
import {feedBacksRepository} from "../repositories/db/feedbacks_repository";
import {PostViewModel} from "../models/modelsPosts/postViewModel";
import {usersRepository} from "../repositories/db/users-db-repository";
import {UserViewModel} from "../models/modelsUsers/usersInputModel";

export const feedbacksService = {
    async getComment(id: string): Promise<CommentViewModel | null> {
        return await feedBacksRepository.getCommentById(id)
    },
    async searchUserForComment(userId: string): Promise<UserViewModel | null> {
        return await usersRepository.findUserForComment(userId)
    },
    async searchPostIdForComments(postId: string):Promise <PostViewModel | null > {
        return await feedBacksRepository.searchPostIdForComments(postId)
    },
    async createComment(postId: string, userId: string, content: string,): Promise<CommentViewModel> {
        const outputUserLogin: UserViewModel | null = await this.searchUserForComment(userId)

        const newComment: CommentDBModel = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: outputUserLogin!.login
            },
            createdAt: new Date().toISOString()
        }
        return await feedBacksRepository.addNewComment(newComment)
    },
    async updateCommentById(id: string, content: string): Promise <boolean> {
        return feedBacksRepository.updateCommentById(id, content)
    },
    async deletedCountComment(id: string):Promise<boolean> {
        return await feedBacksRepository.deleteComment(id)
    }

}