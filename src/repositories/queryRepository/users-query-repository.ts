import {
    getPageNumber,
    getPageSize,
    getSkip,
    getSortBy,
    getDirection, pagesCountOfBlogs,
    PaginatorType, DEFAULT_PAGE_SortBy, SortDirection
} from "../../helpers/pagination-helpers";
import {filterLoginOrEmail} from "../../functions/filters";
import {UserCreateModel, UserViewModel} from "../../models/modelsUsers/usersInputModel";
import {usersCollection} from "../../database/runDB";
import {usersMapping} from "../../functions/usersMapping";
import {WithId} from "mongodb";

export const usersQueryRepository = {

    async returnOfAllUsers
    (searchEmailTerm?: string,
     searchLoginTerm?: string,
     pageNumber?: number,
     pageSize?: number,
     sortBy?: string,
     sortDirection?: string
    ): Promise<PaginatorType<UserViewModel[]>> {

        const calculateOfFiles = await usersCollection.countDocuments(filterLoginOrEmail(searchEmailTerm, searchLoginTerm))
        const foundUsers: WithId<UserCreateModel>[] = await usersCollection
            .find(filterLoginOrEmail(searchEmailTerm, searchLoginTerm))
            .sort({[getSortBy(sortBy)]: getDirection(sortDirection),  [DEFAULT_PAGE_SortBy]: SortDirection.Desc})
            .skip(getSkip(getPageNumber(pageNumber), getPageSize(pageSize)))
            .limit(getPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: usersMapping(foundUsers)
        }
    },
}