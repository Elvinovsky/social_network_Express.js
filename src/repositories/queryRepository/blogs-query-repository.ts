import {blogsCollection, postsCollection} from "../../database/runDB";
import {BlogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {blogMapping} from "../../functions/blogMapping";
import {postMapping} from "../../functions/postMapping";
import {
    getPageNumber,
    getPageSize,
    getSkip,
    getSortBy,
    getDirection, pagesCountOfBlogs,
    PaginatorType, DEFAULT_PAGE_SortBy, SortDirection
} from "../../helpers/pagination-helpers";
import {blockMongo_Id} from "../../functions/filters";
import {Filter} from "mongodb";

export const blogsQueryRepository = {

    async returnOfAllBlogs
    (searchNameTerm?: string,
     pageNumber?: number,
     pageSize?: number,
     sortBy?: string,
     sortDirection?: string,
    ): Promise<PaginatorType<BlogViewModel[]>> {

        const filter: Filter<BlogViewModel> = {}
        if(searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'}
        }
        const calculateOfFiles = await blogsCollection.countDocuments(filter)
        const foundBlogs: BlogViewModel[] = await blogsCollection
                .find(filter, blockMongo_Id)
                .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]: SortDirection.Desc})
                .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
                .limit(getPageSize(pageSize)).toArray()
        return {
                pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
                page: getPageNumber(pageNumber),
                pageSize: getPageSize(pageSize),
                totalCount: calculateOfFiles,
                items: blogMapping(foundBlogs)
            }
    },
    async searchPostByBlogId
    (blogId: string,
     pageNumber: number,
     pageSize: number,
     sortBy?: string,
     sortDirection?: string,
    ):Promise<PaginatorType<PostViewModel[]> | null> {

        const blogIdForPost = await postsCollection.findOne({blogId: blogId}) //express validator .custom
        if (!blogIdForPost){
            return null
        }
        const calculateOfFiles = await postsCollection.countDocuments({blogId})

        const foundBlogs: PostViewModel[] = await postsCollection
            .find({blogId}, blockMongo_Id)
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]: SortDirection.Desc})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: postMapping(foundBlogs)
        }
    },
}
