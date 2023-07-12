import { injectable } from "inversify";
import {
    RequestQuery,
    ResponseViewBody
} from "../types/req-res-types";
import {
    QueryInputParams,
    SearchTitleTerm
} from "../models/query-input-params";
import { PaginatorType } from "../helpers/pagination-helpers";
import { PostView } from "../models/modelsPosts/post-view";
import { postQueryRepository } from "../repositories/queryRepository/posts-query-repository";

@injectable()
export class PostsController {
    async getPosts ( req: RequestQuery<QueryInputParams & SearchTitleTerm>, res: ResponseViewBody<PaginatorType<PostView[]>> ) {
        const getAllPosts: PaginatorType<PostView[]> = await postQueryRepository.returnOfAllPosts(req.query.searchTitleTerm,
            Number(req.query.pageNumber),
            Number(req.query.pageSize),
            req.query.sortBy,
            req.query.sortDirection,
            req.user?.id)
        res.send(getAllPosts)
    }
}