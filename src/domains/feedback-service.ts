import {CommentViewModel} from "../models/modelsComment/comment-view";
import {feedBacksRepository} from "../repositories/db/feedbacks-db-repository";
import {usersRepository} from "../repositories/db/users-db-repository";
import {UserViewModel} from "../models/modelsUsersLogin/user-view";
import {CommentDBModel} from "../models/modelsComment/comment-input";
import {PostDBModel} from "../models/modelsPosts/post-input";
import {userMapping} from "../functions/usersMapping";

export const feedbacksService = {
    async getComment(id: string): Promise<CommentViewModel | null> {
        return await feedBacksRepository.getCommentById(id)
    },
    async searchUserForComment(userId: string): Promise<UserViewModel | null> {
        const user =  await usersRepository.findUserForComment(userId)
            if(!user) return null
        return userMapping(user)
    },
    async searchPostIdForComments(postId: string):Promise <PostDBModel | null > {
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