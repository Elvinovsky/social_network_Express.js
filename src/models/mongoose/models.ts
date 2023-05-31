import mongoose from "mongoose";
import {
    attemptSchema,
    blogSchema,
    commentSchema,
    postSchema,
    RequestAttempt,
    sessionSchema,
    userSchema
} from "./schemas";
import { BlogDBModel } from "../modelsBlogs/blog-input";
import { PostDBModel } from "../modelsPosts/post-input";
import { UserAccountDBModel } from "../modelsUsersLogin/user-input";
import { SessionDBModel } from "../modelsDevice/device-input";
import { CommentDBModel } from "../modelsComment/comment-input";


export const BlogModelClass = mongoose.model<BlogDBModel>('blogs', blogSchema)

export const PostModelClass = mongoose.model<PostDBModel>('posts', postSchema)

export const UserModelClass = mongoose.model<UserAccountDBModel>('users', userSchema)

export const SessionModelClass = mongoose.model<SessionDBModel>('sessions', sessionSchema)

export const CommentModelClass = mongoose.model<CommentDBModel>('comments', commentSchema)

export const AttemptModelClass = mongoose.model<RequestAttempt>('attempt', attemptSchema)