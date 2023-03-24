import {blogsCollection, postsCollection} from "../database/runDB";
import {BlogViewModel} from "../models/modelsBlogs/blogViewModel";
import {PostViewModel} from "../models/modelsPosts/postViewModel";

type PaginatorOutputPosts<PostViewModel> = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": PostViewModel[]
}
type PaginatorOutputBlogs<BlogViewModel> = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": BlogViewModel[]
}

export const queryRepository = {
    /*async pagingFindPosts(pageNumber?: number, pageSize?: number, sortBy?: string, sortDirection?: string): Promise<PaginatorOutputPosts<PostViewModel>> {
        const dbPageNumber = await this.pagingFindPosts(pageNumber) || 1
        const dbPageSize = await this.pagingFindPosts(pageSize) || 10
        const dbSortBy = await this.pagingFindPosts(sortBy) || 'createdAt'
        const dbSortDirection = await this.pagingFindPosts(sortDirection === 'asc' ? 1 : -1 )
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundPosts = await postsCollection.find()
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()
        const numberOfFiles = await postsCollection.countDocuments()
        const pagesCountOfPosts = Math.ceil(numberOfFiles / dbPageSize)
        const formatFoundPosts = foundPosts.map)
        return {
            pagesCount: pagesCountOfPosts,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: numberOfFiles,
            items: formatFoundPosts
        }

    }*/
    async returnOfAllBlogs(name: string | null): Promise<BlogViewModel[]> {
       return name? await blogsCollection.find({name: {$regex: name} }, {projection:{ _id: 0 }}).toArray()
           : await blogsCollection.find({}, {projection:{ _id: 0 }}).toArray()
    },
    async findBlogById(id: string): Promise <BlogViewModel | null> {
        return  await blogsCollection.findOne({id}, {projection:{ _id: 0 }})
    },
    async searchPostByBlogId(blogId: string):Promise<PostViewModel[] | null> {
        return  await postsCollection.find({blogId: blogId}).toArray()
    },
    async returnOfAllPosts(title: string | null): Promise<PostViewModel[]> {
        return title? await postsCollection.find({title: {$regex: title} }, {projection:{ _id: 0 }}).toArray()
            : await postsCollection.find({}, {projection:{ _id: 0 }}).toArray()
    },
    async findPostById(id: string): Promise <PostViewModel | null> {
        return  await postsCollection.findOne({id}, {projection: {_id: 0}})
    },
}