import {Response,Request, Router} from "express";
import {RequestInputBody, RequestParamsId, RequestQuery, ResponseViewBody} from "../req-res-types";
import {UserInputModel, UserViewModel} from "../models/modelsUsers/usersInputModel";
import {usersService} from "../domains/users-service";
import {validatorInputUserBody} from "../middlewares/body-validator/check-bodyUser";
import {PaginatorType} from "../helpers/pagination-helpers";
import {QueryParams, SearchEmailTerm, SearchLoginTerm} from "../models/query-params";
import {usersQueryRepository} from "../repositories/queryRepository/users-query-repository";
import {guardAuthentication} from "../middlewares/guard-authentication";


export const usersRouter = Router()

usersRouter.get('/', guardAuthentication,
    async (req: Request,
           res: Response) => {
        const getAllUsers = await usersQueryRepository.returnOfAllUsers(
            req.query.searchEmailTerm,
            req.query.searchLoginTerm,
            req.query.pageNumber,
            req.query.pageSize,
            req.query.sortBy,
            req.query.sortDirection)

        return !getAllUsers
            ? res.sendStatus(404)
            : res.send(getAllUsers)
    })
usersRouter.post('/', validatorInputUserBody,
    async (req: RequestInputBody<UserInputModel>,
           res: ResponseViewBody<UserViewModel>) => {

        const newUser = await usersService.createUser
        (req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
        return;
    })
usersRouter.get('/:id',
    async (req: RequestParamsId<{ id: string }>,
           res: ResponseViewBody<UserViewModel>) => {
        const getByIdUser = await usersService.findUserById(req.params.id)
        return getByIdUser === null
            ? res.sendStatus(404)
            : res.send(getByIdUser)
    })
usersRouter.delete('/:id', guardAuthentication,
    async (req: RequestParamsId<{ id: string }>,
           res: Response) => {
        const foundUserDelete = await usersService.userByIdDelete(req.params.id)
        if (!foundUserDelete) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204)
        return;
    })