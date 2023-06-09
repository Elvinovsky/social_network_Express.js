import {Router} from "express";
import {superAdminAuthentication} from "../middlewares/guard-authentication/super-admin-authentication";
import {validatorBlogInputBody} from "../middlewares/body-validator/check-bodyBlog";
import {validatorInputBlogPostBody} from "../middlewares/body-validator/check-bodyPost";
import { blogsControllerInstance } from "../controllers/blogs-controller";


export const blogsRouter = Router ()

blogsRouter.get('/',blogsControllerInstance.getBlogs)
blogsRouter.get('/:id', blogsControllerInstance.getBlog)
blogsRouter.get('/:blogId/posts', blogsControllerInstance.getPostsByBlog)
blogsRouter.post('/:blogId/posts', validatorInputBlogPostBody, blogsControllerInstance.createPostForBlog)
blogsRouter.post('/', validatorBlogInputBody, blogsControllerInstance.createBlog)
blogsRouter.put('/:id', validatorBlogInputBody, blogsControllerInstance.updateBlog)
blogsRouter.delete('/:id', superAdminAuthentication, blogsControllerInstance.deleteBlog)

