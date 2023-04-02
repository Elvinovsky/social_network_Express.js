import {
    getMongoPageNumber,
    getMongoPageSize,
    getMongoSkip,
    getMongoSortBy,
    getMongoSortDirection, pagesCountOfBlogs,
    PaginatorType
} from "../../helpers/pagination-helpers";
import {blockMongo_Id, filterLoginOrEmail} from "../../functions/filters";
import {UserCreateModel, UserViewModel} from "../../models/modelsUsers/usersInputModel";
import {usersCollection} from "../../database/runDB";
import {usersMapping} from "../../functions/usersMapping";

export const usersQueryRepository = {

    async returnOfAllUsers
    (searchEmailTerm: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[] | undefined,
     searchLoginTerm: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[] | undefined,
     pageNumber: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[] | undefined,
     pageSize: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[] | undefined,
     sortBy: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[] | undefined,
     sortDirection: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[] | undefined
    ): Promise<PaginatorType<UserViewModel[]> | null> {
        const calculateOfFiles = await usersCollection.countDocuments(filterLoginOrEmail( searchEmailTerm, searchLoginTerm ))
        if (calculateOfFiles === 0) {
            return null
        }
        const foundUsers: UserCreateModel[] = await usersCollection
            .find(filterLoginOrEmail( searchEmailTerm, searchLoginTerm ), blockMongo_Id)
            .sort({
                [getMongoSortBy(sortBy)]: getMongoSortDirection(sortDirection),
                createdAt: getMongoSortDirection(sortDirection)
            })
            .skip(getMongoSkip(getMongoPageNumber(pageNumber), getMongoPageSize(pageSize)))
            .limit(getMongoPageSize(pageSize)).toArray()
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles, pageSize),
            page: getMongoPageNumber(pageNumber),
            pageSize: getMongoPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: usersMapping(foundUsers)
        }
    },
}