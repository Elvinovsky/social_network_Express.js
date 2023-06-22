import {
    RequestInputBody,
    RequestParamsAndInputBody,
    RequestParamsAndInputQuery,
    RequestParamsId,
    RequestQuery,
    ResponseViewBody
} from "../types/req-res-types";
import {
    QueryInputParams,
    SearchNameTerm
} from "../models/query-input-params";
import { Response } from "express";
import { BlogView } from "../models/modelsBlogs/blog-view";
import {
    BlogsService,

} from "../domains/blogs-service";
import { PaginatorType } from "../helpers/pagination-helpers";
import { PostView } from "../models/modelsPosts/post-view";
import { BlogPostInputModel } from "../models/modelsPosts/post-input";
import { BlogInput } from "../models/modelsBlogs/blog-input";

import { BlogsQueryRepo } from "../repositories/queryRepository/blogs-query-repository";
import { PostsService } from "../domains/posts-service";

export class BlogsController {
    constructor (protected blogsQueryRepo: BlogsQueryRepo,
    protected blogsService: BlogsService,
    protected postsService: PostsService) {
    }
    async getBlogs(req: RequestQuery<QueryInputParams&SearchNameTerm>,
                   res: Response) {
        const getAllBlogs = await this.blogsQueryRepo.returnOfAllBlogs(
            req.query.searchNameTerm,
            Number(req.query.pageNumber),
            Number(req.query.pageSize),
            req.query.sortBy,
            req.query.sortDirection)

        res.send(getAllBlogs)

    }
    async getBlog (req: RequestParamsId<{ id: string }>,
                   res: ResponseViewBody<BlogView>) {
        const getByIdBlog = await this.blogsService.findBlogById(req.params.id)
        if (!getByIdBlog) {
            res.sendStatus(404)
            return;
        }
        res.send(getByIdBlog)
        return;
    }
    async getPostsByBlog(req: RequestParamsAndInputQuery<{blogId: string }, QueryInputParams>,
                         res: ResponseViewBody<PaginatorType<PostView[]>>) {
        const getByBlogIdPosts = await this.blogsQueryRepo.searchPostByBlogId(
            req.params.blogId,
            Number(req.query.pageNumber),
            Number(req.query.pageSize),
            req.query.sortBy,
            req.query.sortDirection,
            req.user?.id
            )

        if (!getByBlogIdPosts) {
            res.sendStatus(404)
            return;
        }
        res.send(getByBlogIdPosts)
    }
    async createPostForBlog(req: RequestParamsAndInputBody<{ blogId: string }, BlogPostInputModel>,
                            res: ResponseViewBody<PostView>) {
        const validatorBlogIdForCreatePost = await this.postsService.searchBlogIdForPost(req.params.blogId)
        if (!validatorBlogIdForCreatePost) {
            res.sendStatus(404)
            return;
        }
        const createdNewPost = await this.postsService.createPost
                                                 (req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
        res.status(201).send(createdNewPost)
        return;
    }
    async createBlog(req: RequestInputBody<BlogInput>,
                     res: ResponseViewBody<BlogView>) {

        const createdBlog = await this.blogsService
            .createBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(201).send(createdBlog)
        return;
    }
    async updateBlog(req: RequestParamsAndInputBody<{ id: string }, BlogInput>,
                     res: Response) {
        const searchBlogByIdForUpdate = await this.blogsService.findBlogById(req.params.id)
        if (!searchBlogByIdForUpdate) {
            res.sendStatus(404)
            return;
        }
        const foundBlogForUpdate = await this.blogsService
            .updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (foundBlogForUpdate) {
            res.sendStatus(204)
            return;
        }
    }
    async deleteBlog(req: RequestParamsId<{ id: string }>,
                     res: Response) {
        const foundBlogDelete = await this.blogsService.BlogByIdDelete(req.params.id)
        if (!foundBlogDelete) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204)
        return;
    }
}

