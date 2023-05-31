import mongoose from "mongoose";
import {
    blogSchema,
    postSchema,
    userSchema
} from "./schemas";
import { BlogDBModel } from "../modelsBlogs/blog-input";
import { PostDBModel } from "../modelsPosts/post-input";
import { UserAccountDBModel } from "../modelsUsersLogin/user-input";


export const BlogModelClass = mongoose.model<BlogDBModel>('blogs', blogSchema)

export const PostModelClass = mongoose.model<PostDBModel>('posts', postSchema)

export const UserModelClass = mongoose.model<UserAccountDBModel>('users', userSchema)