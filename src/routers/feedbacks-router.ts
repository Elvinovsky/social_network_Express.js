import {Response, Router} from "express";
import {RequestParamsAndInputBody, RequestParamsId, ResponseViewBody} from "../types/req-res-types";
import {feedbacksService} from "../domains/feedback-service";
import {validatorBlogInputBody} from "../middlewares/body-validator/check-bodyBlog";
import {BlogInputModel} from "../models/modelsBlogs/blogInputModel";
import {blogsService} from "../domains/blogs-service";
import {blogsRouter} from "./blogs-router";
import {validatorInputComment} from "../middlewares/body-validator/check-bodyComment";
import {CommentInputModel, CommentViewModel} from "../models/modelsComment/commentInputModel";
import {userAuthentication} from "../middlewares/guard-authentication/user-authentication";


export const feedBacksRouter = Router()

feedBacksRouter.get('/:id',
    async (req: RequestParamsId<{ id: string }>,
           res: Response) => {
        const comment = await feedbacksService.getComment(req.params.id)
        if(comment) {
            res.send(comment)
        } else {
            res.sendStatus(404)
            return;
        }
    })
feedBacksRouter.put('/:id',validatorInputComment,
    async (req: RequestParamsAndInputBody<{id: string},CommentInputModel>,
           res: Response) => {
        const validatorCommentById = await feedbacksService.getComment(req.params.id)
        if (!validatorCommentById) {
            res.sendStatus(404)
            return;
        }
        const validatorUserId = await feedbacksService.searchUserForComment(req.user!.id)
        if (validatorUserId!.id !== validatorCommentById.commentatorInfo.userId ) {
            res.sendStatus(403)
            return
        }
        const foundCommentForUpdate = await feedbacksService.updateCommentById(req.params.id, req.body.content)
        if (foundCommentForUpdate) {
            res.sendStatus(204)
            return;
        }
    })
feedBacksRouter.delete('/:id',userAuthentication,
    async (req: RequestParamsAndInputBody<{id: string},CommentInputModel>,
           res: Response) => {
        const validatorCommentById = await feedbacksService.getComment(req.params.id)
        if (!validatorCommentById) {
            res.sendStatus(404)
            return;
        }
        const validatorUserId = await feedbacksService.searchUserForComment(req.user!.id)
        if (validatorUserId!.id !== validatorCommentById.commentatorInfo.userId ) {
            res.sendStatus(403)
            return
        }
        const deleteComment = await feedbacksService.deletedCountComment(req.params.id)
        if (deleteComment) {
            res.sendStatus(204)
            return;
        }
    })
