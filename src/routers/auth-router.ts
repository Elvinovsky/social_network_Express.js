import {Response, Router} from "express";
import {RequestInputBody} from "../req-res-types";
import {usersService} from "../domains/users-service";
import {LoginInputModel} from "../models/modelsUsers/loginInputModel";
import {validatorInputAuthRout} from "../middlewares/body-validator/check-bodyUser";
import {jwtService} from "../application/jwt-service";


export const authRouter = Router()

authRouter.post('/login',validatorInputAuthRout,
    async (req: RequestInputBody<LoginInputModel>,
           res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if(user) {
            const token = jwtService.createJWT(user)
            res.status(201).send(token)
        } else {
            res.sendStatus(401)
            return;
        }
    })