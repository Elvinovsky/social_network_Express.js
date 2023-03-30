"use strict";
/* import {PostViewModel} from "../../models/modelsPosts/postViewModel";
import {postsCollection} from "../../database/runDB";
import {postMapping} from "../../functions/postMapping";
import {PaginatorType} from "../../helpers/pagination-helpers";
import {blockMongo_Id} from "../../helpers/posts-helpers";
import {filterTitle} from "../../functions/filters";


export const postQueryRepository = {
    async returnOfAllPosts(searchTitleTerm: string | null,
                           pageNumber: number | null,
                           pageSize: number | null,
                           sortBy: string | null,
                           sortDirection: string | null,): Promise<PaginatorType<PostViewModel[]> | null> {

        const mongoPageNumber = pageNumber? +pageNumber : 1
        const mongoPageSize = pageSize? +pageSize : 10
        const mongoSortBy = sortBy? sortBy : "createdAt"
        const mongoSortDirection = sortDirection? (sortDirection === 'asc'? 1 : -1) : -1
        const mongoPostsToSkip = (+mongoPageNumber - 1) * +mongoPageSize
        const numberOfFiles = await postsCollection.countDocuments(filterTitle(searchTitleTerm))
        if (numberOfFiles === 0) {
            return null
        }
        const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize)


        const foundPosts: PostViewModel[] = await postsCollection
                .find(filterTitle(searchTitleTerm), blockMongo_Id)
                .sort({[mongoSortBy]: mongoSortDirection, createdAt: mongoSortDirection} )
                .skip(mongoPostsToSkip)
                .limit(+mongoPageSize).toArray()
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

} */ 
