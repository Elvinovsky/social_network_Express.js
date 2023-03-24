import {Request, Response, Router} from "express";
import {blogsService} from "../domains/blogs-service";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {RequestInputBody, RequestParamsAndInputBody, ResponseViewBody, RequestParamsId} from "../req-res-types";
import {blogInputModel} from "../models/modelsBlogs/blogInputModel";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
import {checkForErrors} from "../middlewares/check-for-errors";
import {checkInputWebsiteUrl, checkInputDescription, checkInputName} from "../middlewares/validation-inputBody/check-bodyBlog";
import {queryDbRepository} from "../repositories/db/query-db-repository";
import {checksContent, checksShortDescription, checksTitle} from "../middlewares/validation-inputBody/check-bodyPost";
import {BlogPostInputModel} from "../models/modelsPosts/postInputModel";
import {postViewModel} from "../models/modelsPosts/postViewModel";
import {postsService} from "../domains/posts-service";

export const blogsRouter = Router ()


blogsRouter.get('/', async (req: Request, res: Response) => {
    const getAllBlogs = await queryDbRepository.returnOfAllBlogs()
    res.send(getAllBlogs)
    return;
})
blogsRouter.get('/:id', async (req: RequestParamsId<{ id: string }>,
                               res: ResponseViewBody<blogViewModel>) => {
    const getByIdBlog = await queryDbRepository.findBlogById(req.params.id)
    if (!getByIdBlog) {
        res.sendStatus(404)
        return;
    }
    res.send(getByIdBlog)
    return;
})
blogsRouter.get('/:blogId/posts', async (req: RequestParamsId<{ blogId: string }>,
                                         res: ResponseViewBody<postViewModel[]>) => {
    const getByIdPost = await queryDbRepository.searchBlogIdForPost(req.params.blogId)
    return getByIdPost === null
        ? res.sendStatus(404)
        : res.send(getByIdPost)
})
blogsRouter.post('/',
    guardAuthentication, checkInputName, checkInputWebsiteUrl,
     checkInputDescription, checkForErrors,
    async (req: RequestInputBody<blogInputModel>,
           res: ResponseViewBody<blogViewModel>) => {

        const createdBlog = await blogsService
            .CreateBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(201).send(createdBlog)
        return;
    })
blogsRouter.post('/:blogId/posts',
    guardAuthentication, checksTitle, checksShortDescription, checksContent, checkForErrors,
    async (req: RequestParamsAndInputBody<{ blogId: string }, BlogPostInputModel>,
           res: ResponseViewBody<postViewModel>) => {
        const validatorBlogIdForCreatePost = await postsService.searchBlogIdForPost(req.params.blogId)
        if (!validatorBlogIdForCreatePost) {
            res.sendStatus(404)
            return;
        }
        const createdNewPost = await postsService.createPost
        (req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
        res.status(201).send(createdNewPost)
        return;
    })
blogsRouter.post('/',
    guardAuthentication, checkInputName, checkInputWebsiteUrl,
    checkInputDescription, checkForErrors,
    async (req: RequestInputBody<blogInputModel>,
           res: ResponseViewBody<blogViewModel>) => {

        const createdBlog = await blogsService
            .CreateBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(201).send(createdBlog)
        return;
    })
blogsRouter.put('/:id',
    guardAuthentication, checkInputName, checkInputWebsiteUrl,
     checkInputDescription, checkForErrors,
    async (req: RequestParamsAndInputBody<{ id: string }, blogInputModel>,
           res: Response) => {

        const searchBlogByIdForUpdate = await blogsService.findBlogById(req.params.id)
        if (!searchBlogByIdForUpdate) {
            res.sendStatus(404)
            return;
        }
        const foundBlogForUpdate = await blogsService
            .updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (foundBlogForUpdate) {
            res.sendStatus(204)
            return;
        }
    })
blogsRouter.delete('/:id', guardAuthentication,
                                 async (req: RequestParamsId<{ id: string }>,
                                        res: Response) => {
    const foundBlogDelete = await blogsService.BlogByIdDelete(req.params.id)

    if (!foundBlogDelete) {
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204)
        return;
})

