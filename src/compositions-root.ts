import { DevicesSessionsRepository } from "./repositories/db/devices-sessions-repository";
import { JwtService } from "./application/jwt-service";
import { DevicesService } from "./domains/devices-service";
import { AuthController } from "./controllers/auths-controller";
import { DevicesController } from "./controllers/devices-controller";
import { TestDeleteAllDBController } from "./controllers/test-delete-allDB";
import { UsersService } from "./domains/users-service";
import { FeedbackService } from "./domains/feedback-service";
import { LikesQueryRepo } from "./repositories/queryRepository/likes-query-repository";
import { PostsService } from "./domains/posts-service";
import { FeedbacksDbRepository } from "./repositories/db/feedbacks-db-repository";
import { BlogsQueryRepo } from "./repositories/queryRepository/blogs-query-repository";
import { BlogsController } from "./controllers/blogs-controller";
import { BlogsService } from "./domains/blogs-service";
import { EmailsManager } from "./adapter/emails-manager";



export const devicesRepository = new DevicesSessionsRepository()
export const feedBacksRepository = new FeedbacksDbRepository()


export const blogsQueryRepo = new BlogsQueryRepo()
export const likesQueryRepo = new LikesQueryRepo()


export const emailsManager = new EmailsManager()
export const blogsService = new BlogsService()
export const postsService = new PostsService()
export const jwtService = new JwtService()
export const usersService = new UsersService(emailsManager)
export const feedbacksService = new FeedbackService(feedBacksRepository)
export const devicesService = new DevicesService(devicesRepository)



export const blogsControllerInstance = new BlogsController(blogsQueryRepo, blogsService, postsService)
export const authController = new AuthController(jwtService, devicesService, devicesRepository, usersService )
export const devicesController = new DevicesController(devicesRepository, devicesService)
export const deleteAllDBController = new TestDeleteAllDBController(devicesRepository, feedBacksRepository )