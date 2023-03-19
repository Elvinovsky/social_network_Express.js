import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {RequestInputBody, RequestParamsAndInputBody, ResponseViewBody, RequestParamsId} from "../req-res-types";
import {blogInputModel} from "../models/modelsBlogs/blogInputModel";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
import {checkForErrors} from "../middlewares/check-for-errors";
import {checkInputWebsiteUrl, checkInputDescription, checkInputName} from "../middlewares/validation-inputBody/check-bodyBlog";

export const blogsRouter = Router ()


blogsRouter.get('/', async (req: Request, res: Response) => {
    const getAllBlogs = await blogsRepository.returnOfAllBlogs()
    res.send(getAllBlogs)
    return;
})
blogsRouter.post('/',
    guardAuthentication, checkInputWebsiteUrl,
    checkInputName, checkInputDescription, checkForErrors,
    async (req: RequestInputBody<blogInputModel>,
           res: ResponseViewBody<blogViewModel>) => {

        const createdBlog = await blogsRepository
            .addNewBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(201).send(createdBlog)
        return;
    })
blogsRouter.get('/:id', async (req: RequestParamsId<{ id: string }>,
                               res: ResponseViewBody<blogViewModel>) => {

    const getByIdBlog = await blogsRepository.findBlogById(req.params.id)
    if (!getByIdBlog) {
        res.sendStatus(404)
        return;
    }
    res.send(getByIdBlog)
        return;
})
blogsRouter.put('/:id',
    guardAuthentication, checkInputWebsiteUrl,
    checkInputName, checkInputDescription, checkForErrors,
    async (req: RequestParamsAndInputBody<{ id: string }, blogInputModel>,
           res: Response) => {

        const searchBlogByIdForUpdate = await blogsRepository.findBlogById(req.params.id)
        if (!searchBlogByIdForUpdate) {
            res.sendStatus(404)
            return;
        }
        const foundBlogForUpdate = await blogsRepository
            .updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (foundBlogForUpdate) {
            res.sendStatus(204)
            return;
        }
    })
blogsRouter.delete('/:id', guardAuthentication,
                                 async (req: RequestParamsId<{ id: string }>,
                                        res: Response) => {
    const foundBlogDelete = await blogsRepository.searchBlogByIdDelete(req.params.id)

    if (!foundBlogDelete) {
        res.sendStatus(404)
        return;
    }
    res.sendStatus(204)
        return;
})

