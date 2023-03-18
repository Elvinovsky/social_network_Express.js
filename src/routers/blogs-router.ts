import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {RequestInputBody, RequestParamsAndInputBody, ResponseViewBody, RequestParamsId} from "../req-res-types";
import {blogInputModel} from "../models/modelsBlogs/blogInputModel";
import {blogViewModel} from "../models/modelsBlogs/blogViewModel";
import {checkForErrors} from "../middlewares/check-for-errors";
import {checkInputWebsiteUrl, checkInputDescription, checkInputName} from "../middlewares/validation-inputBody/check-bodyBlog";

export const blogsRouter = Router ()


blogsRouter.get('/', (req: Request, res: Response) => {
   const getAllBlogs: blogViewModel[] = blogsRepository.returnOfAllBlogs
    res.send(getAllBlogs)
})
blogsRouter.post('/',
    guardAuthentication, checkInputWebsiteUrl,
    checkInputName, checkInputDescription, checkForErrors,
    (req: RequestInputBody<blogInputModel>,
     res: ResponseViewBody<blogViewModel>) => {

    const createdBlog: blogViewModel = blogsRepository
        .addNewBlog(req.body.name,req.body.description, req.body.websiteUrl)

    res.status(201).send(createdBlog)
})
blogsRouter.get('/:id', (req: RequestParamsId<{ id: string }>,
                                       res: ResponseViewBody<blogViewModel>) => {

    const getByIdBlog = blogsRepository.findBlogById(req.params.id)
    if(!getByIdBlog) {
        res.sendStatus(404)
        return;
    }
    res.send(getByIdBlog)
})
blogsRouter.put('/:id',
    guardAuthentication, checkInputWebsiteUrl,
    checkInputName, checkInputDescription, checkForErrors,
    (req: RequestParamsAndInputBody<{ id: string },blogInputModel>,
     res: Response) => {

    const searchBlogByIdForUpdate = blogsRepository.findBlogById(req.params.id)
    if(!searchBlogByIdForUpdate) {
        res.sendStatus(404)
        return;
    }
    const foundBlogForUpdate = blogsRepository
          .updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
    if(foundBlogForUpdate) {
        res.sendStatus(204)
        return;
    }
})
blogsRouter.delete('/:id', guardAuthentication,
                                 (req: RequestParamsId<{ id: string }>,
                                  res: Response) => {
    const foundBlogDelete = blogsRepository.searchBlogByIdDelete(req.params.id)
    if(!foundBlogDelete) {
        res.sendStatus(404)
    }
    res.sendStatus(204)
})

