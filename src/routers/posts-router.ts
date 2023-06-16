import {
    Response,
    Router
} from "express";
import { postsService } from "../domains/posts-service";
import { superAdminAuthentication } from "../middlewares/guard-authentication/super-admin-authentication";
import {
    RequestInputBody,
    RequestParamsAndInputBody,
    ResponseViewBody,
    RequestParamsId,
    RequestQuery,
    RequestParamsAndInputQuery
} from "../types/req-res-types";
import { PostInput } from "../models/modelsPosts/post-input";
import { PostView } from "../models/modelsPosts/post-view";
import { validatorInputPostBody } from "../middlewares/body-validator/check-bodyPost";
import { postQueryRepository } from "../repositories/queryRepository/posts-query-repository"
import { PaginatorType } from "../helpers/pagination-helpers";
import {
    QueryInputParams,
    SearchTitleTerm
} from "../models/query-input-params";
import { CommentViewModel } from "../models/modelsComment/comment-view";
import { validatorInputComment } from "../middlewares/body-validator/check-bodyComment";
import { CommentInputModel } from "../models/modelsComment/comment-input";
import { userAuthentication } from "../middlewares/guard-authentication/user-authentication";
import {
    feedbacksService,
    jwtService
} from "../compositions-root";
import { LikeModelClass } from "../models/mongoose/models";
import { optionalUserAuth } from "../middlewares/optional-user-authentication";

export const postsRouter = Router()

postsRouter.get('/',
    async( req: RequestQuery<QueryInputParams & SearchTitleTerm>, res: ResponseViewBody<PaginatorType<PostView[]>> ) => {

        const getAllPosts: PaginatorType<PostView[]> = await postQueryRepository.returnOfAllPosts(req.query.searchTitleTerm,
            Number(req.query.pageNumber),
            Number(req.query.pageSize),
            req.query.sortBy,
            req.query.sortDirection)
        console.log(getAllPosts)
        console.log(typeof getAllPosts)
        res.send(getAllPosts)
    })
postsRouter.get('/:id',
    async( req: RequestParamsId<{ id: string }>, res: ResponseViewBody<PostView> ) => {
        const getByIdPost = await postsService.findPostById(req.params.id)
        return getByIdPost === null ? res.sendStatus(404) : res.send(getByIdPost)
    })
postsRouter.get('/:postId/comments', optionalUserAuth,
    async( req: RequestParamsAndInputQuery<{ postId: string }, QueryInputParams>, res: ResponseViewBody<PaginatorType<CommentViewModel[]>> ) => {

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
    })
postsRouter.post('/:postId/comments',
    userAuthentication,
    validatorInputComment,
    async( req: RequestParamsAndInputBody<{
        postId: string
    }, CommentInputModel>, res: ResponseViewBody<CommentViewModel> ) => {

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
    })
postsRouter.post('/',
    validatorInputPostBody,
    async( req: RequestInputBody<PostInput>, res: ResponseViewBody<PostView> ) => {

        const createdNewPost = await postsService.createPost(req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        res.status(201)
           .send(createdNewPost)
        return;
    })
postsRouter.put('/:id',
    validatorInputPostBody,
    async( req: RequestParamsAndInputBody<{ id: string }, PostInput>, res: ResponseViewBody<{}> ) => {

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
    })
postsRouter.delete('/:id',
    superAdminAuthentication,
    async( req: RequestParamsId<{ id: string }>, res: Response ) => {
        const foundPostDelete = await postsService.postByIdDelete(req.params.id)
        if (!foundPostDelete) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204)
        return;
    })