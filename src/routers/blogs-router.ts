import {Router} from "express";
import {superAdminAuthentication} from "../middlewares/guard-authentication/super-admin-authentication";
import {validatorBlogInputBody} from "../middlewares/body-validator/check-bodyBlog";
import {validatorInputBlogPostBody} from "../middlewares/body-validator/check-bodyPost";
import { blogsControllerInstance } from "../controllers/blogs-controller";


export const blogsRouter = Router ()

blogsRouter.get('/',blogsControllerInstance.getBlogs.bind(blogsControllerInstance))
blogsRouter.get('/:id', blogsControllerInstance.getBlog.bind(blogsControllerInstance))
blogsRouter.get('/:blogId/posts', blogsControllerInstance.getPostsByBlog.bind(blogsControllerInstance))
blogsRouter.post('/:blogId/posts', validatorInputBlogPostBody, blogsControllerInstance.createPostForBlog.bind(blogsControllerInstance))
blogsRouter.post('/', validatorBlogInputBody, blogsControllerInstance.createBlog.bind(blogsControllerInstance))
blogsRouter.put('/:id', validatorBlogInputBody, blogsControllerInstance.updateBlog.bind(blogsControllerInstance))
blogsRouter.delete('/:id', superAdminAuthentication, blogsControllerInstance.deleteBlog.bind(blogsControllerInstance))

