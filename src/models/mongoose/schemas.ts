import mongoose from "mongoose";
import { WithId } from "mongodb";
import { BlogDBModel } from "../modelsBlogs/blog-input";
import { PostDBModel } from "../modelsPosts/post-input";
import {
    UserDBType,
    UserMethodType
} from "../modelsUsersLogin/user-input";
import { SessionDBModel } from "../modelsDevice/device-input";
import { CommentDBModel } from "../modelsComment/comment-input";
import {
    LikeDBInfo
} from "../modelsLike/like-input";
import { UserModelType } from "./models";

export const blogSchema = new mongoose.Schema <WithId<BlogDBModel>> ({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: { type: Boolean, required: true}
}, {
    timestamps: true
})

export const postSchema = new mongoose.Schema<WithId<PostDBModel>>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})

export const userSchema = new mongoose.Schema<UserDBType, UserModelType, UserMethodType>({
    login: {type: String, required: true},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    emailConfirmation: {type: Object, required: true}
})
    userSchema.method("canBeConfirmed", function canBeConfirmed () {
    const that = this as UserDBType
    return !that || that.emailConfirmation.expirationDate < new Date() || that.emailConfirmation.isConfirmed
} )

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
    createdAt: {type: String, required: true},
})

export type RequestAttempt = {
    urlAndIp: string, date: string
}

export const attemptSchema = new mongoose.Schema<RequestAttempt>({
    urlAndIp: {type: String, required: true},
    date: {type: String, required: true}
})

export const likeSchema = new mongoose.Schema<LikeDBInfo>({
    status: { type: String, required: true },
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    postOrCommentId: {type: String, required: true},
    createdAt: { type: Date, required: true }
})