import {Request, Response, Router} from "express";
import {postsService} from "../domains/posts-service";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {RequestInputBody, RequestParamsAndInputBody, ResponseViewBody, RequestParamsId} from "../req-res-types";
import {postInputModel} from "../models/modelsPosts/postInputModel";
import {PostViewModel} from "../models/modelsPosts/postViewModel";
import {checksContent, checksBlogId, checksTitle, checksShortDescription} from "../middlewares/body-validator/check-bodyPost";
import {checkForErrors} from "../middlewares/check-for-errors";
import {queryRepository} from "../repositories/query-repository";

export const postsRouter = Router()

postsRouter.get('/', async (req: Request<{},{},{},{title: string | null}>, res: ResponseViewBody<PostViewModel[]>) => {
    const getAllPosts: PostViewModel[] = await queryRepository.returnOfAllPosts(req.query.title)
    res.send(getAllPosts)
    return;
})
postsRouter.get('/:id', async (req: RequestParamsId<{ id: string }>,
                               res: ResponseViewBody<PostViewModel>) => {
    const getByIdPost = await queryRepository.findPostById(req.params.id)
    return getByIdPost === null
        ? res.sendStatus(404)
        : res.send(getByIdPost)
})
postsRouter.post('/',
    guardAuthentication, checksTitle, checksShortDescription, checksContent, checksBlogId, checkForErrors,
    async (req: RequestInputBody<postInputModel>,
           res: ResponseViewBody<PostViewModel>) => {

        const createdNewPost = await postsService.createPost
        (req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        res.status(201).send(createdNewPost)
        return;
    })
postsRouter.put('/:id',
    guardAuthentication, checksTitle, checksShortDescription, checksContent, checksBlogId, checkForErrors,
    async (req: RequestParamsAndInputBody<{ id: string }, postInputModel>,
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