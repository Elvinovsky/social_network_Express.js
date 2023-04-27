import {Response, Router} from "express";
import {RequestInputBody, RequestParamsId, RequestQuery, ResponseViewBody} from "../types/req-res-types";
import {UserInputModel} from "../models/modelsUsersLogin/user-input";
import {usersService} from "../domains/users-service";
import {validatorUserBodyRegistrationForSuperAdmin} from "../middlewares/body-validator/check-bodyUser";
import {PaginatorType} from "../helpers/pagination-helpers";
import {QueryInputParams, SearchEmailTerm, SearchLoginTerm} from "../models/query-input-params";
import {usersQueryRepository} from "../repositories/queryRepository/users-query-repository";
import {superAdminAuthentication} from "../middlewares/guard-authentication/super-admin-authentication";
import {UserViewModel} from "../models/modelsUsersLogin/user-view";



export const usersRouter = Router()

usersRouter.get('/', superAdminAuthentication,
    async (req: RequestQuery<QueryInputParams&SearchEmailTerm&SearchLoginTerm>,
           res: ResponseViewBody<PaginatorType<UserViewModel[]>>) => {
        const getAllUsers = await usersQueryRepository.returnOfAllUsers(
            req.query.searchEmailTerm,
            req.query.searchLoginTerm,
            Number(req.query.pageNumber),
            Number(req.query.pageSize),
            req.query.sortBy,
            req.query.sortDirection)

            res.send(getAllUsers)
    })
usersRouter.post('/', validatorUserBodyRegistrationForSuperAdmin,
    async (req: RequestInputBody<UserInputModel>,
           res: ResponseViewBody<UserViewModel>) => {
        const newUser = await usersService.userByAnAdminRegistration
        (req.body.login, req.body.password, req.body.email)
        res.status(201).send(newUser)
        return;
    })
usersRouter.get('/:id', superAdminAuthentication,
    async (req: RequestParamsId<{ id: string }>,
           res: ResponseViewBody<UserViewModel>) => {
        const getByIdUser = await usersService.findUserById(req.params.id)
        return getByIdUser === null
            ? res.sendStatus(404)
            : res.send(getByIdUser)
    })
usersRouter.delete('/:id', superAdminAuthentication,
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