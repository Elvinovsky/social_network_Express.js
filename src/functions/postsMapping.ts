import { PostView } from "../models/modelsPosts/post-view";
import { WithId } from "mongodb";
import { PostDBModel } from "../models/modelsPosts/post-input";
import { feedbacksService } from "../compositions-root";
import { likesOrDisCount } from "../helpers/like-helpers";
import { LikeInfoView } from "../models/modelsLike/like-view";
import { LikeModelClass } from "../models/mongoose/models";
import { LikeDBInfo } from "../models/modelsLike/like-input";

export const postsMapping = async ( array: Array<WithId<PostDBModel>>, userId?: string):Promise<PostView[]> => {
    return Promise
        .all( array.map(async ( el ) => {
        const status = await feedbacksService.likesInfoCurrentUser(el._id,
            userId)

        const countsLikeAndDis = await likesOrDisCount(el._id)

        const likes: LikeDBInfo[] = await LikeModelClass.find({
            postOrCommentId: el._id.toString(),
            status: "Like"
        })

        const lastLikes:Promise<LikeInfoView[]> = Promise.all(likes.sort(function ( a, b ) {
            return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
        })
                               .reverse()
                               .map(async lastLikes => {
                                   return {
                                       addedAt: lastLikes.createdAt.toISOString(),
                                       userId: lastLikes.userId,
                                       login: lastLikes.userLogin
                                   }
                               })
                               .slice(0,
                                   3))


        return {
            id: el._id.toString(),
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt,
            extendedLikesInfo: {
                likesCount: countsLikeAndDis.likes,
                dislikesCount: countsLikeAndDis.disLikes,
                myStatus: status,
                newestLikes: await lastLikes
            }
        }
    }))
}
export const postMapping = async ( post: WithId<PostDBModel>, userId?: string ): Promise<PostView> => {
    const status = await feedbacksService.likesInfoCurrentUser(post._id,
        userId)

    const countsLikeAndDis = await likesOrDisCount(post._id)

    const likes: LikeDBInfo[] = await LikeModelClass.find({
        postOrCommentId: post._id.toString(),
        status: "Like"
    })

    const lastLikes: LikeInfoView[] = await Promise.all(likes.sort( function ( a, b ) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    }).reverse().map(async lastLikes => {
                               return {
                                   addedAt: lastLikes.createdAt.toISOString(),
                                   userId: lastLikes.userId,
                                   login: lastLikes.userLogin
                               }
                           }).slice(0,
                               3))

    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: countsLikeAndDis.likes,
            dislikesCount: countsLikeAndDis.disLikes,
            myStatus: status,
            newestLikes: lastLikes
        }
    }
}