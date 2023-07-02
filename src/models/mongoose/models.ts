import mongoose, { Model } from "mongoose";
import {
    attemptSchema,
    blogSchema,
    commentSchema,
    likeSchema,
    postSchema,
    RequestAttempt,
    sessionSchema,
    userSchema
} from "./schemas";
import { BlogDBModel } from "../modelsBlogs/blog-input";
import { PostDBModel } from "../modelsPosts/post-input";
import {
    UserDBType,
    UserMethodModel
} from "../modelsUsersLogin/user-input";
import { SessionDBModel } from "../modelsDevice/device-input";
import { CommentDBModel } from "../modelsComment/comment-input";
import { LikeDBInfo } from "../modelsLike/like-input";


export const BlogModelClass = mongoose.model<BlogDBModel>('blogs', blogSchema)

export const PostModelClass = mongoose.model<PostDBModel>('posts', postSchema)


export type UserModelType = Model<UserDBType, {}, UserMethodModel>
export const UserModelClass = mongoose.model<UserDBType, UserModelType>('users', userSchema)

export const SessionModelClass = mongoose.model<SessionDBModel>('sessions', sessionSchema)

export const CommentModelClass = mongoose.model<CommentDBModel>('comments', commentSchema)

export const AttemptModelClass = mongoose.model<RequestAttempt>('attempt', attemptSchema)

export const LikeModelClass = mongoose.model<LikeDBInfo>('likes', likeSchema)