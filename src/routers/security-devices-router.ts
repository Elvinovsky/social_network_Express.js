import { Router } from "express";
import { refreshTokenAuthentication } from "../middlewares/guard-authentication/user-authentication";

export const securityDevicesRouter = Router();

securityDevicesRouter.get('/devices', refreshTokenAuthentication,
    async ( req: Request, res: Response) => {

    })
securityDevicesRouter.delete('/devices', refreshTokenAuthentication,
    async ( req: Request, res: Response) => {

    })
securityDevicesRouter.delete('/devices/:deviceId', refreshTokenAuthentication,
    async ( req: Request, res: Response) => {

    })