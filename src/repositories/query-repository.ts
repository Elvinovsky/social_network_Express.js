import {blogsCollection, postsCollection} from "../database/runDB";
import {BlogViewModel} from "../models/modelsBlogs/blogViewModel";
import {PostViewModel} from "../models/modelsPosts/postViewModel";
import {blogMapping} from "../functions/blogMapping";
import {postMapping} from "../functions/postMapping";

export type PaginatorOutputPosts<PostViewModel> = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": PostViewModel
}
export type PaginatorOutputBlogs<BlogViewModel> = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": BlogViewModel
}
const blockMongo_Id =  {projection:{ _id: 0 }}

export const queryRepository = {
    async returnOfAllBlogs(searchNameTerm?: string,
                           pageNumber?: number,
                           pageSize?: number,
                           sortBy?: string,
                           sortDirection?: string,): Promise<PaginatorOutputBlogs<BlogViewModel[]>> {

        const mongoPageNumber = pageNumber || 1
        const mongoPageSize = pageSize || 10
        const mongoSortBy = sortBy || 'createdAt'
        const mongoSortDirection = sortDirection === 'asc'? 1 : -1
        const mongoBlogsToSkip = (mongoPageNumber - 1) * mongoPageSize
        const numberOfFiles = await postsCollection.countDocuments()
        const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize)

        const foundBlogsName: BlogViewModel[] = await blogsCollection
            .find({name: {$regex: searchNameTerm, $options: "i"}}, blockMongo_Id)
            .sort({[mongoSortBy]: mongoSortDirection})
            .skip(mongoBlogsToSkip)
            .limit(mongoPageSize).toArray()
        const foundBlogs= await blogsCollection
            .find({},blockMongo_Id)
            .sort({[mongoSortBy]: mongoSortDirection})
            .skip(mongoBlogsToSkip)
            .limit(mongoPageSize).toArray()

        return {
            pagesCount: pagesCountOfPosts,
            page: mongoPageNumber,
            pageSize: mongoPageSize,
            totalCount: numberOfFiles,
            items: searchNameTerm? blogMapping(foundBlogsName) : blogMapping(foundBlogs)
        }
    },
    async findBlogById(id: string): Promise <BlogViewModel | null> {
       return await blogsCollection.findOne({id}, blockMongo_Id)
    },
    async searchPostByBlogId(blogId: string,
                             pageNumber?: number,
                             pageSize?: number,
                             sortBy?: string,
                             sortDirection?: string,):Promise<PaginatorOutputPosts<PostViewModel[]> | null> {
        const mongoPageNumber = pageNumber || 1
        const mongoPageSize = pageSize || 10
        const mongoSortBy = sortBy || 'createdAt'
        const mongoSortDirection = sortDirection === 'asc'? 1 : -1
        const mongoPostsToSkip = (mongoPageNumber - 1) * mongoPageSize
        const numberOfFiles = await postsCollection.countDocuments({blogId})
        const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize)
        const foundBlogs: PostViewModel[] = await postsCollection
            .find({blogId: blogId})
            .sort({[mongoSortBy]: mongoSortDirection})
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
    async returnOfAllPosts(searchTitleTerm?: string,
            pageNumber?: number,
            pageSize?: number,
            sortBy?: string,
            sortDirection?: string,): Promise<PaginatorOutputPosts<PostViewModel[]>> {

        const mongoPageNumber = pageNumber || 1
        const mongoPageSize = pageSize || 10
        const mongoSortBy = sortBy || 'createdAt'
        const mongoSortDirection = sortDirection === 'asc'? 1 : -1
        const mongoPostsToSkip = (mongoPageNumber - 1) * mongoPageSize
        const numberOfFiles = await postsCollection.countDocuments(searchTitleTerm? {searchTitleTerm} : {})
        const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize)

        const foundPostsTitle: PostViewModel[] = await postsCollection
            .find({title: {$regex: searchTitleTerm, $options: "i"}}, blockMongo_Id)
            .sort({[mongoSortBy]: mongoSortDirection})
            .skip(mongoPostsToSkip)
            .limit(mongoPageSize).toArray()
        const foundPosts: PostViewModel[] = await postsCollection
            .find({},blockMongo_Id)
            .sort({[mongoSortBy]: mongoSortDirection})
            .skip(mongoPostsToSkip)
            .limit(mongoPageSize).toArray()

        return {
            pagesCount: pagesCountOfPosts,
            page: mongoPageNumber,
            pageSize: mongoPageSize,
            totalCount: numberOfFiles,
            items: searchTitleTerm? postMapping(foundPostsTitle) : postMapping(foundPosts)
        }
    },
    async findPostById(id: string): Promise <PostViewModel | null> {
        return  await postsCollection.findOne({id}, blockMongo_Id)
    },
}