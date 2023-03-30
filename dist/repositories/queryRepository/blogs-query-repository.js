"use strict";
/* import {blogsCollection, postsCollection} from "../../database/runDB";
import {BlogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {blogMapping} from "../../functions/blogMapping";
import {postMapping} from "../../functions/postMapping";
import {PaginatorType} from "../../helpers/pagination-helpers";
import {blockMongo_Id} from "../../helpers/blogs-helpers";
import {filterName} from "../../functions/filters";



export const blogsQueryRepository = {
    async returnOfAllBlogs(searchNameTerm: string  | null,
                           pageNumber: number | null,
                           pageSize: number | null,
                           sortBy: string | null,
                           sortDirection: string | null): Promise<PaginatorType<BlogViewModel[]> | null> {

        const mongoPageNumber = pageNumber? +pageNumber : 1
        const mongoPageSize = pageSize? +pageSize : 10
        const mongoSortBy = sortBy? sortBy : 'createdAt'
        const mongoSortDirection = sortDirection === 'asc'? 1 : -1
        const mongoBlogsToSkip = (+mongoPageNumber - 1) * +mongoPageSize
        const numberOfFiles = await blogsCollection.countDocuments(filterName(searchNameTerm))
        if(numberOfFiles === 0) {
            return null
        }
        const pagesCountOfBlogs = Math.ceil(numberOfFiles / mongoPageSize)

        const foundBlogs: BlogViewModel[] = await blogsCollection
                .find(filterName(searchNameTerm), blockMongo_Id)
                .sort({[mongoSortBy]: mongoSortDirection, createdAt: mongoSortDirection})
                .skip(mongoBlogsToSkip)
                .limit(mongoPageSize).toArray()
        return {
                pagesCount: pagesCountOfBlogs,
                page: mongoPageNumber,
                pageSize: mongoPageSize,
                totalCount: numberOfFiles,
                items: blogMapping(foundBlogs)
            }
    },
    async findBlogById(id: string): Promise <BlogViewModel | null> {
       return await blogsCollection.findOne({id}, blockMongo_Id)
    },
    async searchPostByBlogId(blogId: string,
                             pageNumber: number | null,
                             pageSize: number | null,
                             sortBy: string | null,
                             sortDirection: string | null,):Promise<PaginatorType<PostViewModel[]> | null> {
        const blogIdForPost = await postsCollection.findOne({blogId: blogId})
        if (!blogIdForPost){
            return null
        }
        const mongoPageNumber = pageNumber? +pageNumber : 1
        const mongoPageSize = pageSize? +pageSize : 10
        const mongoSortBy = sortBy? sortBy : 'createdAt'
        const mongoSortDirection = sortDirection? (sortDirection === 'asc'? 1 : -1) : -1
        const mongoPostsToSkip = (+mongoPageNumber - 1) * +mongoPageSize
        const numberOfFiles = await postsCollection.countDocuments({blogId})
        const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize)

        const foundBlogs: PostViewModel[] = await postsCollection
            .find({blogId: blogId})
            .sort({[mongoSortBy]: mongoSortDirection, createdAt: mongoSortDirection})
            .skip(mongoPostsToSkip)
            .limit(mongoPageSize).toArray()
        return {
            pagesCount: pagesCountOfPosts,
            page: mongoPageNumber,
            pageSize: mongoPageSize,
            totalCount: numberOfFiles,
            items: postMapping(foundBlogs)
        }
    },
} */ 
