import { Router } from "express";
import { superAdminAuthentication } from "../middlewares/guard-authentication/super-admin-authentication";
import { validatorBlogInputBody } from "../middlewares/body-validator/check-bodyBlog";
import { validatorInputBlogPostBody } from "../middlewares/body-validator/check-bodyPost";
import { optionalUserAuth } from "../middlewares/optional-user-authentication";
import { container } from "../compositions-root";
import { BlogsController } from "../controllers/blogs-controller";

const blogsController = container.resolve(BlogsController)
export const blogsRouter = Router()

blogsRouter.get('/',
    blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id',
    blogsController.getBlog.bind(blogsController))
blogsRouter.get('/:blogId/posts',
    optionalUserAuth,
    blogsController.getPostsByBlog.bind(blogsController))
blogsRouter.post('/:blogId/posts',
    validatorInputBlogPostBody,
    blogsController.createPostForBlog.bind(blogsController))
blogsRouter.post('/',
    validatorBlogInputBody,
    blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id',
    validatorBlogInputBody,
    blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id',
    superAdminAuthentication,
    blogsController.deleteBlog.bind(blogsController))

