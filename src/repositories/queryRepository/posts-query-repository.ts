import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {postsCollection} from "../../database/runDB";
import {postMapping} from "../../functions/postMapping";
import {
    getPageNumber, getPageSize,
    getSkip,
    getSortBy,
    getDirection, pagesCountOfBlogs,
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
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), createdAt: getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: postMapping(foundPosts)
            }
    },
}