import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/db/posts-db-repository";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {RequestInputBody, RequestParamsAndInputBody, ResponseViewBody, RequestParamsId} from "../req-res-types";
import {postInputModel} from "../models/modelsPosts/postInputModel";
import {postViewModel} from "../models/modelsPosts/postViewModel";
import {checksContent, checksBlogId, checksTitle, checksShortDescription} from "../middlewares/validation-inputBody/check-bodyPost";
import {checkForErrors} from "../middlewares/check-for-errors";

export const postsRouter = Router()

postsRouter.get('/', async (req: Request, res: ResponseViewBody<postViewModel[]>) => {
    const getAllPosts: postViewModel[] = await postsRepository.returnOfAllPosts()
    res.send(getAllPosts)
    return;
})
postsRouter.post('/',
    guardAuthentication, checksTitle, checksShortDescription, checksContent, checksBlogId, checkForErrors,
    async (req: RequestInputBody<postInputModel>,
           res: ResponseViewBody<postViewModel>) => {

        const createdNewPost = await postsRepository.addNewPost
        (req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        res.status(201).send(createdNewPost)
        return;
    })
postsRouter.get('/:id', async (req: RequestParamsId<{ id: string }>,
                               res: ResponseViewBody<postViewModel>) => {
    const getByIdPost = await postsRepository.findPostById(req.params.id)
    if (!getByIdPost) {
        res.sendStatus(404);
    }
    res.send(getByIdPost)
    return;
})
postsRouter.put('/:id',
    guardAuthentication, checksTitle, checksShortDescription, checksContent, checksBlogId, checkForErrors,
    async (req: RequestParamsAndInputBody<{ id: string }, postInputModel>,
           res: ResponseViewBody<{}>) => {

        const searchPostByIdForUpdate = await postsRepository.findPostById(req.params.id)
        if (!searchPostByIdForUpdate) {
            res.sendStatus(404)
            return;
        }
        const foundPostForUpdate = await postsRepository
            .updatePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content)

        if (foundPostForUpdate) {
            res.sendStatus(204)
            return;
        }
    })
postsRouter.delete('/:id', guardAuthentication,
    async (req: RequestParamsId<{ id: string }>,
           res: Response) => {
        const foundPostDelete = await postsRepository.PostByIdDelete(req.params.id)
        if (!foundPostDelete) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204)
        return;
    })