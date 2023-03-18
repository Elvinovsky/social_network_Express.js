import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {RequestInputBody, RequestParamsAndInputBody, ResponseViewBody, RequestParamsId} from "../req-res-types";
import {postInputModel} from "../models/modelsPosts/postInputModel";
import {postViewModel} from "../models/modelsPosts/postViewModel";
import {checksContent, checksBlogId, checksTitle, checksShortDescription} from "../middlewares/validation-inputBody/check-bodyPost";
import {checkForErrors} from "../middlewares/check-for-errors";

export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const getAllPosts: postViewModel[] = postsRepository.returnOfAllPosts
    res.send(getAllPosts)})
postsRouter.post('/',
    guardAuthentication, checksShortDescription, checksTitle, checksContent, checksBlogId, checkForErrors,
    (req: RequestInputBody<postInputModel>,
     res: ResponseViewBody<postViewModel | string>) => {

    const validationInputBlogId = postsRepository.searchBlogIdForPost(req.body.blogId)
    if(!validationInputBlogId) {
        res.status(404).send("blogId not found")
        return;
    }
    const createdNewPost = postsRepository.addNewPost
    (req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

    res.status(201).send(createdNewPost)
})
postsRouter.get('/:id', (req: RequestParamsId<{ id: string }>,
                                       res: ResponseViewBody<postViewModel>) => {
    const getByIdPost = postsRepository.findPostById(req.params.id)
    if(!getByIdPost) {
      res.sendStatus(404);
    }
    res.send(getByIdPost)
})
postsRouter.put('/:id',
    guardAuthentication, checksShortDescription, checksTitle, checksContent, checksBlogId, checkForErrors,
    (req: RequestParamsAndInputBody<{ id: string }, postInputModel>,
     res: ResponseViewBody<string>) => {

    const searchPostByIdForUpdate = postsRepository.findPostById(req.params.id)
    if(!searchPostByIdForUpdate) {
        res.sendStatus(404)
        return;
    }
    const validationInputBlogId = postsRepository.searchBlogIdForPost(req.body.blogId)
    if(!validationInputBlogId) {
      res.status(404).send("blogId not found")
        return;
    }
   const foundPostForUpdate = postsRepository
         .updatePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

    if(foundPostForUpdate) {
        res.sendStatus(204)
    }
})
postsRouter.delete('/:id', guardAuthentication,
    (req: RequestParamsId<{ id: string }>,
     res: Response) => {
    const foundPostDelete = postsRepository.searchForPostByIdDelete(req.params.id)
    if(!foundPostDelete) {
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204)
})