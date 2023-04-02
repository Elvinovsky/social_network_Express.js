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
import {blockMongo_Id} from "../../functions/filters";
import {Filter} from "mongodb";


export const postQueryRepository = {
    async returnOfAllPosts
    (searchTitleTerm: string | undefined,
     pageNumber?: number,
     pageSize?: number,
     sortBy?: string,
     sortDirection?: string,
    ): Promise<PaginatorType<PostViewModel[]>> {

        const filter: Filter<PostViewModel> = {}
        if(searchTitleTerm) {
            filter.title = {$regex: searchTitleTerm, $options: 'i'}
        }

        const calculateOfFiles = await postsCollection.countDocuments(filter)
        const foundPosts: PostViewModel[] = await postsCollection
            .find(filter, blockMongo_Id)
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