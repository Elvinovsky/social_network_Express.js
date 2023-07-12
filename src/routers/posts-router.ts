import {
    Request,
    Response,
    Router
} from "express";
import { superAdminAuthentication } from "../middlewares/guard-authentication/super-admin-authentication";
import {
    RequestInputBody,
    RequestParamsAndInputBody,
    RequestParamsAndInputQuery,
    RequestParamsId,
    ResponseViewBody
} from "../types/req-res-types";
import { PostInput } from "../models/modelsPosts/post-input";
import { PostView } from "../models/modelsPosts/post-view";
import { validatorInputPostBody } from "../middlewares/body-validator/check-bodyPost";
import { postQueryRepository } from "../repositories/queryRepository/posts-query-repository"
import { PaginatorType } from "../helpers/pagination-helpers";
import { QueryInputParams } from "../models/query-input-params";
import { CommentViewModel } from "../models/modelsComment/comment-view";
import {
    checkInputLikeValue,
    validatorInputComment
} from "../middlewares/body-validator/check-bodyComment";
import { CommentInputModel } from "../models/modelsComment/comment-input";
import { userAuthentication } from "../middlewares/guard-authentication/user-authentication";
import {
    container,
    feedbacksService,
    postsService
} from "../compositions-root";
import { optionalUserAuth } from "../middlewares/optional-user-authentication";
import { checkForErrors } from "../middlewares/check-for-errors";
import { postsRepository } from "../repositories/db/posts-db-repository";
import { PostsController } from "../controllers/posts-controller";

export const postsRouter = Router()
const postsController = container.resolve(PostsController)

postsRouter.get('/',
    optionalUserAuth,
    postsController.getPosts.bind(PostsController))
postsRouter.get('/:id',
    optionalUserAuth,
    async( req: RequestParamsId<{ id: string }>, res: ResponseViewBody<PostView> ) => {
        const getByIdPost = await postsRepository.getPostById(req.params.id,
            req.user?.id)
        return getByIdPost === null ? res.sendStatus(404) : res.send(getByIdPost)
    })
postsRouter.get('/:postId/comments',
    optionalUserAuth,
    postsController.getCommentsByPostId.bind(PostsController)
    )
postsRouter.post('/:postId/comments',
    userAuthentication,
    validatorInputComment,
    postsController.createCommentByPost.bind(PostsController)
   )
postsRouter.post('/',
    validatorInputPostBody,
    postsController.createPost.bind(PostsController)
   )
postsRouter.put('/:id',
    validatorInputPostBody,
    postsController.updatePost.bind(PostsController)
   )
postsRouter.put('/:postId/like-status',
    userAuthentication,
    checkInputLikeValue,
    checkForErrors,
    postsController.updateLikeByPost.bind(PostsController)
    )

postsRouter.delete('/:id',
    superAdminAuthentication,
    postsController.deletePost.bind(PostsController)
    )