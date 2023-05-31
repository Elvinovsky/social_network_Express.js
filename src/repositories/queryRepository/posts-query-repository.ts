import {PostView} from "../../models/modelsPosts/post-view";
import {feedbacksCollection} from "../../database/runDB";
import {postsMapping} from "../../functions/postsMapping";
import {
    getPageNumber, getPageSize,
    getSkip,
    getSortBy,
    getDirection, pagesCountOfBlogs,
    PaginatorType, DEFAULT_PAGE_SortBy
} from "../../helpers/pagination-helpers";
import {WithId} from "mongodb";
import {CommentViewModel} from "../../models/modelsComment/comment-view";
import {commentsMapping} from "../../functions/commentsMapping";
import {CommentDBModel} from "../../models/modelsComment/comment-input";
import {PostDBModel} from "../../models/modelsPosts/post-input";
import { PostModelClass } from "../../models/mongoose/models";
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
    async searchCommentsByPostId
    (postId: string,
     pageNumber: number,
     pageSize: number,
     sortBy?: string,
     sortDirection?: string,
    ):Promise<PaginatorType<CommentViewModel[]> | null> {

        const postIdForPost = await feedbacksCollection.findOne({postId: postId}) //express validator .custom
        if (!postIdForPost){
            return null
        }
        const calculateOfFiles = await feedbacksCollection.countDocuments({postId})

        const foundComments: WithId<CommentDBModel>[] = await feedbacksCollection
            .find({postId})
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: commentsMapping(foundComments)
        }
    }
}