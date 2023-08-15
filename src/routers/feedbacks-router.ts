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
import { LikeModelClass } from "../models/mongoose/models";
import { ObjectId } from "mongodb";
import { optionalUserAuth } from "../middlewares/optional-user-authentication";

// Создаем экземпляр роутера
export const feedBacksRouter = Router()

// Маршрут для получения комментария по его идентификатору
feedBacksRouter.get('/:id',
    optionalUserAuth,
    async( req: RequestParamsId<{ id: string }>, res: Response ) => {

        // Получаем комментарий с указанным id и id пользователя, если он авторизован
        const comment = await feedbacksService.getComment(req.params.id,
            req.user?.id,)
        if (!comment) {
            res.sendStatus(404) // Ошибка: Не найдено.
            return;
        }

        res.send(comment)
        return
    })

// Маршрут для обновления комментария
feedBacksRouter.put('/:id',
    validatorInputComment,
    userAuthentication,
    async( req: RequestParamsAndInputBody<{ id: string }, CommentInputModel>, res: Response ) => {
        // Проверяем, существует ли комментарий с указанным id
        const validatorCommentById = await feedbacksService.getComment(req.params.id)
        if (!validatorCommentById) {
            res.sendStatus(404) // Ошибка: Не найдено.
            return;
        }

        // Проверяем, является ли пользователь автором комментария
        const validatorUserId = await feedbacksService.findUserForComment(req.user!.id)
        if (validatorUserId!.id !== validatorCommentById.commentatorInfo.userId) {
            res.sendStatus(403) // Ошибка: Запрещено (отказано в доступе).
            return
        }

        // Обновляем комментарий
        const foundCommentForUpdate = await feedbacksService.updateCommentById(req.params.id,
            req.body.content)
        if (foundCommentForUpdate) {
            res.sendStatus(204) // Успешный статус: OK, без содержимого.
            return;
        }
    })

// Маршрут для удаления комментария
feedBacksRouter.delete('/:id',
    userAuthentication,
    async( req: RequestParamsAndInputBody<{ id: string }, CommentInputModel>, res: Response ) => {
        // Проверяем, существует ли комментарий с указанным id
        const comment = await feedbacksService.getComment(req.params.id)
        if (!comment) {
            res.sendStatus(404) // Ошибка: Не найдено.
            return;
        }

        // Проверяем, является ли пользователь автором комментария
        const user = await feedbacksService.findUserForComment(req.user!.id)
        if (user!.id !== comment.commentatorInfo.userId) {
            res.sendStatus(403) // Ошибка: Запрещено (отказано в доступе).
            return
        }

        // Удаляем комментарий
        const deleteComment = await feedbacksService.deleteComment(req.params.id)
        if (deleteComment) {
            res.sendStatus(204) // Успешный статус: OK, без содержимого.
            return;
        }
    })

// Маршрут для установки статуса "лайк" для комментария
feedBacksRouter.put('/:commentId/like-status',
    userAuthentication,
    checkInputLikeValue,
    checkForErrors,
    async( req: Request, res: Response ) => {
        try {
            const statusType = req.body.likeStatus
            const userId = req.user!.id
            const userLogin = req.user!.login
            const commentId = req.params.commentId

            // Получаем комментарий по id
            const comment = await feedbacksService.getComment(commentId)
            if (!comment) {
                res.sendStatus(404) // Ошибка: Не найдено.
                return
            }

            // Создаем или обновляем лайк для комментария
            const result = await feedbacksService.createOrUpdateLike(commentId,
                userId,
                userLogin,
                statusType)
            if (result) {
                res.sendStatus(204) // Успешный статус: OK, без содержимого.
                return
            }

            res.sendStatus(500) // Внутренняя ошибка сервера.
            return

        } catch (error) {
            console.log(error)
            res.sendStatus(500) // Внутренняя ошибка сервера.
        }
    })