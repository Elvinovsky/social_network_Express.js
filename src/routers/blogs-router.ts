import {Response, Router} from "express";
import {blogsService} from "../domains/blogs-service";
import {guardAuthentication} from "../middlewares/guard-authentication";
import {
    RequestInputBody,
    RequestParamsAndInputBody,
    ResponseViewBody,
    RequestParamsId,
    RequestParamsAndInputQuery, RequestQuery
} from "../req-res-types";
import {BlogInputModel} from "../models/modelsBlogs/blogInputModel";
import {BlogViewModel} from "../models/modelsBlogs/blogViewModel";
import {validatorBlogInputBody} from "../middlewares/body-validator/check-bodyBlog";
import {blogsQueryRepository} from "../repositories/queryRepository/blogs-query-repository";
import {validatorInputBlogPostBody} from "../middlewares/body-validator/check-bodyPost";
import {BlogPostInputModel} from "../models/modelsPosts/postInputModel";
import {PostViewModel} from "../models/modelsPosts/postViewModel";
import {postsService} from "../domains/posts-service";
import {QueryParams, SearchNameTerm} from "../models/query-params";
import {PaginatorType} from "../helpers/pagination-helpers";



export const blogsRouter = Router ()


blogsRouter.get('/',
    async (req: RequestQuery<QueryParams&SearchNameTerm>,
                   res: Response) => {
    const getAllBlogs = await blogsQueryRepository.returnOfAllBlogs(
        req.query.searchNameTerm,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection)

    return getAllBlogs === null
        ? res.status(404).send("searchNameTerm not found")
        : res.send(getAllBlogs)

})
blogsRouter.get('/:id',
    async (req: RequestParamsId<{ id: string }>,
                   res: ResponseViewBody<BlogViewModel>) => {
    const getByIdBlog = await blogsService.findBlogById(req.params.id)
    if (!getByIdBlog) {
        res.sendStatus(404)
        return;
    }
    res.send(getByIdBlog)
    return;
})
blogsRouter.get('/:blogId/posts',
    async (req: RequestParamsAndInputQuery<{blogId: string }, QueryParams>,
                   res: ResponseViewBody<PaginatorType<PostViewModel[]>>) => {
    const getByBlogIdPosts = await blogsQueryRepository.searchPostByBlogId(
        req.params.blogId,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection,)

    if (!getByBlogIdPosts) {
        res.sendStatus(404)
        return;
    }
    res.send(getByBlogIdPosts)
})
blogsRouter.post('/:blogId/posts', validatorInputBlogPostBody,
    async (req: RequestParamsAndInputBody<{ blogId: string }, BlogPostInputModel>,
           res: ResponseViewBody<PostViewModel>) => {
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
blogsRouter.post('/', validatorBlogInputBody,
    async (req: RequestInputBody<BlogInputModel>,
           res: ResponseViewBody<BlogViewModel>) => {

    const createdBlog = await blogsService
        .createBlog(req.body.name, req.body.description, req.body.websiteUrl)

    res.status(201).send(createdBlog)
        return;
    })
blogsRouter.put('/:id', validatorBlogInputBody,
    async (req: RequestParamsAndInputBody<{ id: string }, BlogInputModel>,
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

