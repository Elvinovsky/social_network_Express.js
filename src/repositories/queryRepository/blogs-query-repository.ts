import {blogsCollection, postsCollection} from "../../database/runDB";
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
import {Filter, WithId} from "mongodb";
import {BlogDBModel} from "../../models/modelsBlogs/blog-input";
import {PostDBModel} from "../../models/modelsPosts/post-input";

export const blogsQueryRepository = {

    async returnOfAllBlogs
    (searchNameTerm?: string,
     pageNumber?: number,
     pageSize?: number,
     sortBy?: string,
     sortDirection?: string,
    ): Promise<PaginatorType<BlogView[]>> {

        const filter: Filter<BlogDBModel> = {}
        if(searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }
        const calculateOfFiles = await blogsCollection.countDocuments(filter)
        const foundBlogs: WithId<BlogDBModel>[] = await blogsCollection
                .find(filter)
                .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)})
                .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
                .limit(getPageSize(pageSize)).toArray()
        return {
                pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
                page: getPageNumber(pageNumber),
                pageSize: getPageSize(pageSize),
                totalCount: calculateOfFiles,
                items: blogsMapping(foundBlogs)
            }
    },
    async searchPostByBlogId
    (blogId: string,
     pageNumber: number,
     pageSize: number,
     sortBy?: string,
     sortDirection?: string,
    ):Promise<PaginatorType<PostView[]> | null> {

        const blogIdForPost = await postsCollection.findOne({blogId: blogId}) //express validator .custom
        if (!blogIdForPost){
            return null
        }
        const calculateOfFiles = await postsCollection.countDocuments({blogId})

        const foundBlogs: WithId<PostDBModel>[] = await postsCollection
            .find({blogId})
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]:getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: postsMapping(foundBlogs)
        }
    },
}
