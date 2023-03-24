import {Request, Response, Router} from "express";
import {blogsService} from "../domains/blogs-service";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {RequestInputBody, RequestParamsAndInputBody, ResponseViewBody, RequestParamsId} from "../req-res-types";
import {blogInputModel} from "../models/modelsBlogs/blogInputModel";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
import {checkForErrors} from "../middlewares/check-for-errors";
import {checkInputWebsiteUrl, checkInputDescription, checkInputName} from "../middlewares/validation-inputBody/check-bodyBlog";
import {queryDbRepository} from "../repositories/db/query-db-repository";

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

