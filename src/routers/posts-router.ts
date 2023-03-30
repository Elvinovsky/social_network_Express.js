import {Response, Router} from "express";
import {postsService} from "../domains/posts-service";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {
    RequestInputBody,
    RequestParamsAndInputBody,
    ResponseViewBody,
    RequestParamsId,
    RequestQuery
} from "../req-res-types";
import {PostInputModel} from "../models/modelsPosts/postInputModel";
import {PostViewModel} from "../models/modelsPosts/postViewModel";
import {validatorInputPostBody} from "../middlewares/body-validator/check-bodyPost";
import {postQueryRepository} from "../repositories/queryRepository/posts-query-repository"
import {PaginatorType} from "../helpers/pagination-helpers";
import {QueryParamsAndTitleTerm} from "../models/query-params";

export const postsRouter = Router()

postsRouter.get('/',
    async (req: RequestQuery<QueryParamsAndTitleTerm>,
                   res: ResponseViewBody<PaginatorType<PostViewModel[]> | string>) => {

    const getAllPosts: PaginatorType<PostViewModel[]> | null = await postQueryRepository.returnOfAllPosts(
        req.query.searchTitleTerm,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection)

    return getAllPosts === null
           ? res.status(404).send("searchNameTerm not found")
           : res.send(getAllPosts)
})
postsRouter.get('/:id',
    async (req: RequestParamsId<{ id: string }>,
                   res: ResponseViewBody<PostViewModel>) => {
    const getByIdPost = await postQueryRepository.findPostById(req.params.id)
    return getByIdPost === null
        ? res.sendStatus(404)
        : res.send(getByIdPost)
})
postsRouter.post('/', validatorInputPostBody,
    async (req: RequestInputBody<PostInputModel>,
           res: ResponseViewBody<PostViewModel>) => {

        const createdNewPost = await postsService.createPost
        (req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        res.status(201).send(createdNewPost)
        return;
    })
postsRouter.put('/:id', validatorInputPostBody,
    async (req: RequestParamsAndInputBody<{ id: string }, PostInputModel>,
           res: ResponseViewBody<{}>) => {

        const validatorPostByIdForUpdate = await postsService.findPostById(req.params.id)
        if (!validatorPostByIdForUpdate) {
            res.sendStatus(404)
            return;
        }
        const postForUpdate = await postsService
            .updatePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content)

        if (postForUpdate) {
            res.sendStatus(204)
            return;
        }
    })
postsRouter.delete('/:id', guardAuthentication,
    async (req: RequestParamsId<{ id: string }>,
           res: Response) => {
        const foundPostDelete = await postsService.postByIdDelete(req.params.id)
        if (!foundPostDelete) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204)
        return;
    })