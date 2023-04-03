import {Response, Router} from "express";
import {RequestInputBody} from "../req-res-types";
import {usersService} from "../domains/users-service";
import {validatorInputUserBody} from "../middlewares/body-validator/check-bodyUser";
import {LoginInputModel} from "../models/modelsUsers/loginInputModel";


export const authRouter = Router()

authRouter.post('/login', validatorInputUserBody,
    async (req: RequestInputBody<LoginInputModel>,
           res: Response) => {
    const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if(!checkResult) {
            res.sendStatus(401)
            return;
        }
        res.sendStatus(204)
        return
    })