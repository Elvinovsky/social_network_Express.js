import { injectable } from "inversify";
import {
    RequestInputBody,
    RequestParamsAndInputBody,
    RequestParamsAndInputQuery,
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
import { CommentViewModel } from "../models/modelsComment/comment-view";
import { CommentInputModel } from "../models/modelsComment/comment-input";
import {
    feedbacksService,
    postsService
} from "../compositions-root";
import { PostInput } from "../models/modelsPosts/post-input";
import {
    Request,
    Response
} from "express";

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

    async getCommentsByPostId ( req: RequestParamsAndInputQuery<{
        postId: string
    }, QueryInputParams>, res: ResponseViewBody<PaginatorType<CommentViewModel[]>> ) {

        const getCommentsByPostId = await postQueryRepository.getCommentsByPostId(req.params.postId,
            Number(req.query.pageNumber),
            Number(req.query.pageSize),
            req.query.sortBy,
            req.query.sortDirection,
            req.user?.id)

        if (!getCommentsByPostId) {
            res.sendStatus(404)
            return;
        }
        res.send(getCommentsByPostId)
        return
    }

    async createCommentByPost ( req: RequestParamsAndInputBody<{
        postId: string
    }, CommentInputModel>, res: ResponseViewBody<CommentViewModel> ) {

        const validatorPostIdForCreateComments = await feedbacksService.findPostIdForComments(req.params.postId)
        if (!validatorPostIdForCreateComments) {
            res.sendStatus(404)
            return;
        }
        const comment = await feedbacksService.createComment(req.params.postId,
            req.user!.id,
            req.body.content)
        res.status(201)
           .send(comment)
    }

    async createPost ( req: RequestInputBody<PostInput>, res: ResponseViewBody<PostView> ) {

        const createdNewPost = await postsService.createPost(req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)

        res.status(201)
           .send(createdNewPost)
        return;
    }

    async updatePost ( req: RequestParamsAndInputBody<{ id: string }, PostInput>, res: ResponseViewBody<{}> ) {

        const validatorPostByIdForUpdate = await postsService.findPostById(req.params.id)
        if (!validatorPostByIdForUpdate) {
            res.sendStatus(404)
            return;
        }
        const postForUpdate = await postsService
            .updatePostById(req.params.id,
                req.body.title,
                req.body.shortDescription,
                req.body.content)

        if (postForUpdate) {
            res.sendStatus(204)
            return;
        }
    }
    async updateLikeByPost( req: Request, res: Response ) {
    try {
    const statusType = req.body.likeStatus
    const userId = req.user!.id
    const userLogin = req.user!.login
    const postId = req.params.postId

    const validatorPostByIdForUpdate = await postsService.findPostById(postId)
    if (!validatorPostByIdForUpdate) {
    res.sendStatus(404)
    return;
}

const result = await feedbacksService.createOrUpdateLike(postId,
    userId,
    userLogin,
    statusType)
if (result) {
    res.sendStatus(204)
    return
}
res.sendStatus(500)
return

} catch (error) {
    console.log(error)
    res.sendStatus(500)
}
}
}