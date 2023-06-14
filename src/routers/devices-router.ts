import {
    Router
} from "express";
import { refreshTokenAuthentication } from "../middlewares/guard-authentication/user-authentication";
import { devicesController } from "../compositions-root";

export const devicesRouter = Router();


devicesRouter.get('/devices',
    refreshTokenAuthentication,
    devicesController.getDevices.bind(devicesController))

devicesRouter.delete('/devices',
    refreshTokenAuthentication,
    devicesController.deleteDevices.bind(devicesController))

devicesRouter.delete('/devices/:deviceId',
    refreshTokenAuthentication,
    devicesController.deleteDevicesById.bind(devicesController))