import {PostView} from "../../models/modelsPosts/post-view";
import {postsMapping} from "../../functions/postsMapping";
import {
    getPageNumber, getPageSize,
    getSkip,
    getSortBy,
    getDirection, pagesCountOfBlogs,
    PaginatorType, DEFAULT_PAGE_SortBy
} from "../../helpers/pagination-helpers";
import {
    ObjectId,
    WithId
} from "mongodb";
import {CommentViewModel} from "../../models/modelsComment/comment-view";
import {commentsMapping} from "../../functions/commentsMapping";
import {CommentDBModel} from "../../models/modelsComment/comment-input";
import {PostDBModel} from "../../models/modelsPosts/post-input";
import {
    CommentModelClass,
    PostModelClass
} from "../../models/mongoose/models";
import mongoose from "mongoose";


export const postQueryRepository = {
    async returnOfAllPosts
    (searchTitleTerm: string | undefined,
     pageNumber?: number,
     pageSize?: number,
     sortBy?: string,
     sortDirection?: string,
    ): Promise<PaginatorType<PostView[]>> {

        const filter: mongoose.FilterQuery<PostDBModel> = {}
        if(searchTitleTerm) {
            filter.title = {$regex: searchTitleTerm, $options: 'i'}
        }

        const calculateOfFiles = await PostModelClass.countDocuments(filter)
        const foundPosts: WithId<PostDBModel>[] = await PostModelClass
            .find(filter)
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection),  [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize))
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: postsMapping(foundPosts)
            }
    },
    async getCommentsByPostId
    (postId: string,
     pageNumber: number,
     pageSize: number,
     sortBy?: string,
     sortDirection?: string,
     userId?: string
     ):Promise<PaginatorType<CommentViewModel[]> | null> {

        const postIdForComment = await PostModelClass.findOne({_id: new ObjectId(postId)}) //express validator .custom
        if (!postIdForComment){
            return null
        }
        const calculateOfFiles = await CommentModelClass.countDocuments({postId: postId})

        const foundComments: WithId<CommentDBModel>[] = await CommentModelClass
            .find({postId: postId})
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize))
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: await commentsMapping(foundComments, userId)
        }
    }
}