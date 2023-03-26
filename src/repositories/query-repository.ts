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
    async returnOfAllBlogs(searchNameTerm: string  | null,
                           pageNumber: number | null,
                           pageSize: number | null,
                           sortBy: string | null,
                           sortDirection: string | null): Promise<PaginatorOutputBlogs<BlogViewModel[]> | null> {

        const mongoPageNumber = pageNumber? +pageNumber : 1
        const mongoPageSize = pageSize? +pageSize : 10
        const mongoSortBy = sortBy? sortBy : 'createdAt'
        const mongoSortDirection = sortDirection === 'asc'? 1 : -1
        const mongoBlogsToSkip = (+mongoPageNumber - 1) * +mongoPageSize
        const numberOfFiles = await postsCollection.countDocuments(searchNameTerm ? {name: {$regex: searchNameTerm, $options: "i"}} : {})
        const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize)


        if(searchNameTerm){
            const foundBlogsName: BlogViewModel[] = await blogsCollection
                .find({name: {$regex: searchNameTerm, $options: "i"}}, blockMongo_Id)
                .sort({[mongoSortBy]: mongoSortDirection})
                .skip(mongoBlogsToSkip)
                .limit(mongoPageSize).toArray()
            return {
                pagesCount: pagesCountOfPosts,
                page: mongoPageNumber,
                pageSize: mongoPageSize,
                totalCount: numberOfFiles,
                items: blogMapping(foundBlogsName)
            }
        }

        const foundBlogs = await blogsCollection
            .find({},blockMongo_Id)
            .sort({[mongoSortBy]: mongoSortDirection})
            .skip(mongoBlogsToSkip)
            .limit(mongoPageSize).toArray()
        return {
            pagesCount: pagesCountOfPosts,
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
                             sortDirection: string | null,):Promise<PaginatorOutputPosts<PostViewModel[]>> {
        const mongoPageNumber = pageNumber? pageNumber : 1
        const mongoPageSize = pageSize? pageSize : 10
        const mongoSortBy = sortBy? sortBy : 'createdAt'
        const mongoSortDirection = sortDirection? (sortDirection === 'asc'? 1 : -1) : -1
        const mongoPostsToSkip = (+mongoPageNumber - 1) * +mongoPageSize
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
    async returnOfAllPosts(searchTitleTerm: string | null,
                           pageNumber: number | null,
                           pageSize: number | null,
                           sortBy: string | null,
                           sortDirection: string | null,): Promise<PaginatorOutputPosts<PostViewModel[]> | null> {

        const mongoPageNumber = pageNumber? +pageNumber : 1
        const mongoPageSize = pageSize? +pageSize : 10
        const mongoSortBy = sortBy? sortBy : 'createdAt'
        const mongoSortDirection = sortDirection? (sortDirection === 'asc'? 1 : -1) : -1
        const mongoPostsToSkip = (+mongoPageNumber - 1) * +mongoPageSize
        const numberOfFiles = await postsCollection.countDocuments(searchTitleTerm? {title: {$regex: searchTitleTerm, $options: "i"}} : {})
        const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize)

       if(searchTitleTerm) {
            const foundPostsTitle: PostViewModel[] = await postsCollection
                .find({title: {$regex: searchTitleTerm, $options: "i"}}, blockMongo_Id)
                .sort({[mongoSortBy]: mongoSortDirection})
                .skip(mongoPostsToSkip)
                .limit(+mongoPageSize).toArray()
            return {
               pagesCount: pagesCountOfPosts,
               page: mongoPageNumber,
               pageSize: mongoPageSize,
               totalCount: numberOfFiles,
               items: postMapping(foundPostsTitle)
           }
        }
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
            items: postMapping(foundPosts)
        }
    },
    async findPostById(id: string): Promise <PostViewModel | null> {
        return  await postsCollection.findOne({id}, blockMongo_Id)
    },
}