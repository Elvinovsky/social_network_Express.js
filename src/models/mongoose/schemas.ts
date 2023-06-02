import mongoose from "mongoose";
import { WithId } from "mongodb";
import { BlogDBModel } from "../modelsBlogs/blog-input";
import { PostDBModel } from "../modelsPosts/post-input";
import {
    UserAccountDBModel
} from "../modelsUsersLogin/user-input";
import { SessionDBModel } from "../modelsDevice/device-input";
import { CommentDBModel } from "../modelsComment/comment-input";

export const blogSchema = new mongoose.Schema <WithId<BlogDBModel>> ({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: { type: Boolean, required: true}
})

export const postSchema = new mongoose.Schema<WithId<PostDBModel>>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const userSchema = new mongoose.Schema<WithId<UserAccountDBModel>>({
    login: {type: String, required: true},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    emailConfirmation: {type: Object, required: true}
})

export const sessionSchema = new mongoose.Schema<WithId<SessionDBModel>>({
    deviceId: {type: String, required: true},
    issuedAt: {type: Number, required: true},
    userId: {type: String, required: true},
    ip: {type: String || null},
    title: {type: String || null, required: true},
    lastActiveDate: {type: String, required: true},
    expirationDate: {type: Date, required: true}
})

export const commentSchema = new mongoose.Schema<CommentDBModel>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {type: Object, required: true},
    createdAt: {type: String, required: true}
})

export type RequestAttempt = {
    urlAndIp: string, date: string
}

export const attemptSchema = new mongoose.Schema<RequestAttempt>({
    urlAndIp: {type: String, required: true},
    date: {type: String, required: true}
})