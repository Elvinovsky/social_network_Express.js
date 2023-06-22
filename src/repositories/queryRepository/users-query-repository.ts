import {
    getPageNumber,
    getPageSize,
    getSkip,
    getSortBy,
    getDirection,
    pagesCountOfBlogs,
    PaginatorType,
    DEFAULT_PAGE_SortBy
} from "../../helpers/pagination-helpers";
import { filterLoginOrEmail } from "../../functions/filters";
import { UserAccountDBModel } from "../../models/modelsUsersLogin/user-input";
import { usersMapping } from "../../functions/usersMapping";
import {
    ObjectId,
    WithId
} from "mongodb";
import {
    MeViewModel,
    UserViewModel
} from "../../models/modelsUsersLogin/user-view";
import { UserModelClass } from "../../models/mongoose/models";

export const usersQueryRepository = {

    async returnOfAllUsers ( searchEmailTerm?: string, searchLoginTerm?: string, pageNumber?: number, pageSize?: number, sortBy?: string, sortDirection?: string ): Promise<PaginatorType<UserViewModel[]>> {

        const calculateOfFiles = await UserModelClass.countDocuments(filterLoginOrEmail(searchEmailTerm,
            searchLoginTerm))
        const foundUsers: WithId<UserAccountDBModel>[] = await UserModelClass
            .find(filterLoginOrEmail(searchEmailTerm,
                searchLoginTerm))
            .sort({
                [getSortBy(sortBy)]: getDirection(sortDirection),
                [DEFAULT_PAGE_SortBy]: getDirection(sortDirection)
            })
            .skip(getSkip(getPageNumber(pageNumber),
                getPageSize(pageSize)))
            .limit(getPageSize(pageSize))
        return {
            pagesCount: pagesCountOfBlogs(calculateOfFiles,
                pageSize),
            page: getPageNumber(pageNumber),
            pageSize: getPageSize(pageSize),
            totalCount: calculateOfFiles,
            items: usersMapping(foundUsers)
        }
    },
    async getUserInfo ( id: string ): Promise<MeViewModel | null> {
        const user = await UserModelClass.findOne({ _id: new ObjectId(id) })
        if (!user) {
            return null
        }
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        }
    }
}