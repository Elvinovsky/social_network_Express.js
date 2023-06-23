import {BlogView} from "../../models/modelsBlogs/blog-view";
import {PostView} from "../../models/modelsPosts/post-view";
import {blogsMapping} from "../../functions/blogsMapping";
import {postsMapping} from "../../functions/postsMapping";
import {
    getPageNumber,
    getPageSize,
    getSkip,
    getSortBy,
    getDirection, pagesCountOfBlogs,
    PaginatorType, DEFAULT_PAGE_SortBy
} from "../../helpers/pagination-helpers";
import {WithId} from "mongodb";
import {BlogDBModel} from "../../models/modelsBlogs/blog-input";
import {PostDBModel} from "../../models/modelsPosts/post-input";
import {
    BlogModelClass,
    PostModelClass
} from "../../models/mongoose/models";
import mongoose from "mongoose";
import { injectable } from "inversify";

@injectable()
export class BlogsQueryRepo {

    async returnOfAllBlogs
    (searchNameTerm?: string,
     pageNumber?: number,
     pageSize?: number,
     sortBy?: string,
     sortDirection?: string,
    ): Promise<PaginatorType<BlogView[]>> {

        const filter: mongoose.FilterQuery<BlogDBModel> = {}
        if(searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }
        const calculateOfFiles = await BlogModelClass.countDocuments(filter)
        const foundBlogs: WithId<BlogDBModel>[] = await BlogModelClass
            .find(filter)
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize))
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: blogsMapping(foundBlogs)
        }
    }
    async searchPostByBlogId
    (blogId: string,
     pageNumber: number,
     pageSize: number,
     sortBy?: string,
     sortDirection?: string,
     userId?: string
    ):Promise<PaginatorType<PostView[]> | null> {

        const blogIdForPost = await PostModelClass.findOne({blogId: blogId}) //express validator .custom
        if (!blogIdForPost){
            return null
        }
        const calculateOfFiles = await PostModelClass.countDocuments({blogId})

        const foundBlogs: WithId<PostDBModel>[] = await PostModelClass
            .find({blogId})
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]:getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).lean()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: await postsMapping(foundBlogs, userId)
        }
    }
}

