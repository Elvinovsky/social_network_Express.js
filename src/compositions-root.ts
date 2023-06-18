import { DevicesSessionsRepository } from "./repositories/db/devices-sessions-repository";
import { JwtService } from "./application/jwt-service";
import { DevicesService } from "./domains/devices-service";
import { AuthController } from "./controllers/auths-controller";
import { DevicesController } from "./controllers/devices-controller";
import { TestDeleteAllDBController } from "./controllers/test-delete-allDB";
import { UsersService } from "./domains/users-service";
import { FeedbackService } from "./domains/feedback-service";
import { LikesQueryRepo } from "./repositories/queryRepository/likes-query-repository";



export const devicesRepository = new DevicesSessionsRepository()
export const jwtService = new JwtService()
export const usersService = new UsersService()
export const feedbacksService = new FeedbackService()
export const likesQueryRepo = new LikesQueryRepo()
export const devicesService = new DevicesService(devicesRepository)
export const authController = new AuthController(jwtService, devicesService, devicesRepository, usersService )
export const devicesController = new DevicesController(devicesRepository, devicesService)

export const deleteAllDBController = new TestDeleteAllDBController(devicesRepository)