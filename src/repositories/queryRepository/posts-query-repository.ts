import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {feedbacksCollection, postsCollection} from "../../database/runDB";
import {postsMapping} from "../../functions/postsMapping";
import {
    getPageNumber, getPageSize,
    getSkip,
    getSortBy,
    getDirection, pagesCountOfBlogs,
    PaginatorType, DEFAULT_PAGE_SortBy
} from "../../helpers/pagination-helpers";
import {blockMongo_Id} from "../../functions/filters";
import {Filter, WithId} from "mongodb";
import {CommentDBModel, CommentViewModel} from "../../models/modelsComment/commentInputModel";
import {commentsMapping} from "../../functions/commentsMapping";


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
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection),  [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: postsMapping(foundPosts)
            }
    },
    async searchCommentsByPostId
    (postId: string,
     pageNumber: number,
     pageSize: number,
     sortBy?: string,
     sortDirection?: string,
    ):Promise<PaginatorType<CommentViewModel[]> | null> {

        const postIdForPost = await feedbacksCollection.findOne({postId: postId}) //express validator .custom
        if (!postIdForPost){
            return null
        }
        const calculateOfFiles = await feedbacksCollection.countDocuments({postId})

        const foundComments: WithId<CommentDBModel>[] = await feedbacksCollection
            .find({postId})
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection), [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: commentsMapping(foundComments)
        }
    }
}