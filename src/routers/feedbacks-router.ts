import {
    Request,
    Response,
    Router
} from "express";
import {
    RequestParamsAndInputBody,
    RequestParamsId,
    ResponseViewBody
} from "../types/req-res-types";
import { validatorBlogInputBody } from "../middlewares/body-validator/check-bodyBlog";
import { BlogInput } from "../models/modelsBlogs/blog-input";
import { blogsService } from "../domains/blogs-service";
import { blogsRouter } from "./blogs-router";
import {
    checkInputLikeValue,
    validatorInputComment
} from "../middlewares/body-validator/check-bodyComment";
import { CommentViewModel } from "../models/modelsComment/comment-view";
import { userAuthentication } from "../middlewares/guard-authentication/user-authentication";
import { CommentInputModel } from "../models/modelsComment/comment-input";
import { feedbacksService } from "../compositions-root";
import { checkForErrors } from "../middlewares/check-for-errors";
import { feedBacksRepository } from "../repositories/db/feedbacks-db-repository";
import { LikeModelClass } from "../models/mongoose/models";


export const feedBacksRouter = Router()

feedBacksRouter.get('/:id',
    async( req: RequestParamsId<{ id: string }>, res: Response ) => {
        const comment = await feedbacksService.getComment(req.params.id)
        if (comment) {
            res.send(comment)
        } else{
            res.sendStatus(404)
            return;
        }
    })
feedBacksRouter.put('/:id',
    validatorInputComment,
    userAuthentication,
    async( req: RequestParamsAndInputBody<{ id: string }, CommentInputModel>, res: Response ) => {
        const validatorCommentById = await feedbacksService.getComment(req.params.id)
        if (!validatorCommentById) {
            res.sendStatus(404)
            return;
        }
        const validatorUserId = await feedbacksService.searchUserForComment(req.user!.id)
        if (validatorUserId!.id !== validatorCommentById.commentatorInfo.userId) {
            res.sendStatus(403)
            return
        }
        const foundCommentForUpdate = await feedbacksService.updateCommentById(req.params.id,
            req.body.content)
        if (foundCommentForUpdate) {
            res.sendStatus(204)
            return;
        }
    })
feedBacksRouter.delete('/:id',
    userAuthentication,
    async( req: RequestParamsAndInputBody<{ id: string }, CommentInputModel>, res: Response ) => {
        const comment = await feedbacksService.getComment(req.params.id)
        if (!comment) {
            res.sendStatus(404)
            return;
        }
        const user = await feedbacksService.searchUserForComment(req.user!.id)
        if (user!.id !== comment.commentatorInfo.userId) {
            res.sendStatus(403)
            return
        }
        const deleteComment = await feedbacksService.deletedCountComment(req.params.id)
        if (deleteComment) {
            res.sendStatus(204)
            return;
        }
    })

feedBacksRouter.put('/:commentId/like-status',
    userAuthentication,
    checkInputLikeValue,
    checkForErrors,
    async( req: Request, res: Response ) => {

        try {
            const likeStatus = req.body.likeStatus
            const userId = req.user!.id
            const commentId = req.params.commentId

            const comment = await feedBacksRepository.getCommentById(commentId)
            if (!comment) {
                res.sendStatus(404)
                return
            }
            debugger;

            const newLikeInfo = new LikeModelClass({
                status: likeStatus,
                userId,
                postOrCommentId: commentId,
                createdAt: new Date()
            })

            await newLikeInfo.save()

            res.sendStatus(204)
            return

        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    })