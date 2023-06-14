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
import {
    feedbacksService,
    jwtService
} from "../compositions-root";
import { checkForErrors } from "../middlewares/check-for-errors";
import { feedBacksRepository } from "../repositories/db/feedbacks-db-repository";
import { LikeModelClass } from "../models/mongoose/models";
import { ObjectId } from "mongodb";
import { statusTypeHelper } from "../helpers/like-helpers";


export const feedBacksRouter = Router()

feedBacksRouter.get('/:id',
    async( req: RequestParamsId<{ id: string }>, res: Response ) => {
        const comment = await feedbacksService.getComment(req.params.id)
        if (req.headers.authorization) {

            const token = (req.headers.authorization).split(' ')[1]

            const userId = await jwtService.getUserIdByAccessToken(token)

            const likeInfo = await LikeModelClass.findOne({
                userId: userId,
                postOrCommentId: req.params.id
            })

            if (comment && likeInfo) {
                comment.likesInfo.myStatus = likeInfo.status
                res.send(comment)
                return
            } else {
                res.sendStatus(404)
                return;
            }
        } else if (comment) {
            res.send(comment)
            return
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
        const validatorUserId = await feedbacksService.findUserForComment(req.user!.id)
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
        const user = await feedbacksService.findUserForComment(req.user!.id)
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
            const statusType = req.body.likeStatus
            const userId = req.user!.id
            const commentId = req.params.commentId

            const comment = await feedbacksService.getComment(commentId)
            if (!comment) {
                res.sendStatus(404)
                return
            }

            const isAlreadyLiked = await LikeModelClass.findOne({
                userId: userId,
                postOrCommentId: commentId
            })

            //если пользователь не ставил ранне оценку коментарию
            if (!isAlreadyLiked) {
                const newLikeInfo = new LikeModelClass({
                    status: statusType,
                    userId,
                    postOrCommentId: commentId,
                    createdAt: new Date()
                })
                await newLikeInfo.save()

                res.sendStatus(204)
                return
            }
            // если отправленный статус "None"
            if (isAlreadyLiked.status === statusType) {
                res.sendStatus(204)
                return
            }
            // если отправленный статус не совпадает с существующий статусом в БД
            const changeLikeInfo = await LikeModelClass.updateOne({
                    userId: userId,
                    postOrCommentId: commentId
                },
                { $set: { status: statusType } })

            res.sendStatus(204)
            return


        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    })