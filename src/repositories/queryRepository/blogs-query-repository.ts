import {blogsCollection, postsCollection} from "../../database/runDB";
import {BlogViewModel} from "../../models/modelsBlogs/blogViewModel";
import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {blogMapping} from "../../functions/blogMapping";
import {postMapping} from "../../functions/postMapping";
import {
    getMongoPageNumber,
    getMongoPageSize,
    getMongoSkip,
    getMongoSortBy,
    getMongoSortDirection, pagesCountOfBlogs,
    PaginatorType
} from "../../helpers/pagination-helpers";
import {blockMongo_Id, filterName} from "../../functions/filters";

export const blogsQueryRepository = {

    async returnOfAllBlogs
    (searchNameTerm: string  | null,
     pageNumber: number | null,
     pageSize: number | null,
     sortBy: string | null,
     sortDirection: string | null
): Promise<PaginatorType<BlogViewModel[]> | null> {
        const calculateOfFiles = await blogsCollection.countDocuments(filterName(searchNameTerm))
        if(calculateOfFiles === 0) {
            return null
        }
        const foundBlogs: BlogViewModel[] = await blogsCollection
                .find(filterName(searchNameTerm), blockMongo_Id)
                .sort({[getMongoSortBy(sortBy)]: getMongoSortDirection(sortDirection), createdAt: getMongoSortDirection(sortDirection)})
                .skip(getMongoSkip(getMongoPageNumber(pageNumber), getMongoPageSize(pageSize)))
                .limit(getMongoPageSize(pageSize)).toArray()
        return {
                pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
                page: getMongoPageNumber(pageNumber),
                pageSize: getMongoPageSize(pageSize),
                totalCount: calculateOfFiles,
                items: blogMapping(foundBlogs)
            }
    },
    async searchPostByBlogId
    (blogId: string,
     pageNumber: number | null,
     pageSize: number | null,
     sortBy: string | null,
     sortDirection: string | null,
):Promise<PaginatorType<PostViewModel[]> | null> {

        const blogIdForPost = await postsCollection.findOne({blogId: blogId})
        if (!blogIdForPost){
            return null
        }
        const calculateOfFiles = await postsCollection.countDocuments({blogId})

        const foundBlogs: PostViewModel[] = await postsCollection
            .find({blogId}, blockMongo_Id)
            .sort({[getMongoSortBy(sortBy)]: getMongoSortDirection(sortDirection), createdAt: getMongoSortDirection(sortDirection)})
            .skip(getMongoSkip(getMongoPageNumber(pageNumber), getMongoPageSize(pageSize)))
            .limit(getMongoPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getMongoPageNumber(pageNumber),
            pageSize: getMongoPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: postMapping(foundBlogs)
        }
    },
}
