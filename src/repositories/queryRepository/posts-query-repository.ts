import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {postsCollection} from "../../database/runDB";
import {postMapping} from "../../functions/postMapping";
import {
    getMongoPageNumber, getMongoPageSize,
    getMongoSkip,
    getMongoSortBy,
    getMongoSortDirection, pagesCountOfBlogs,
    PaginatorType
} from "../../helpers/pagination-helpers";
import {blockMongo_Id, filterTitle} from "../../functions/filters";

export const postQueryRepository = {
    async returnOfAllPosts
    (searchTitleTerm: string | null,
     pageNumber: number | null,
     pageSize: number | null,
     sortBy: string | null,
     sortDirection: string | null,
): Promise<PaginatorType<PostViewModel[]> | null> {

        const calculateOfFiles = await postsCollection.countDocuments(filterTitle(searchTitleTerm))
        if (calculateOfFiles === 0) {
            return null
        }
        const foundPosts: PostViewModel[] = await postsCollection
            .find(filterTitle(searchTitleTerm), blockMongo_Id)
            .sort({[getMongoSortBy(sortBy)]: getMongoSortDirection(sortDirection), createdAt: getMongoSortDirection(sortDirection)})
            .skip(getMongoSkip(getMongoPageNumber(pageNumber), getMongoPageSize(pageSize)))
            .limit(getMongoPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getMongoPageNumber(pageNumber),
            pageSize: getMongoPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: postMapping(foundPosts)
            }
    },
}