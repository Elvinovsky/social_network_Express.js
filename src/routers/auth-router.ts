import {Response, Router} from "express";
import {RequestInputBody} from "../req-res-types";
import {usersService} from "../domains/users-service";
import {LoginInputModel} from "../models/modelsUsers/loginInputModel";
import {validatorInputAuthRout} from "../middlewares/body-validator/check-bodyUser";


export const authRouter = Router()

authRouter.post('/login',validatorInputAuthRout,
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