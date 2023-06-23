import { Router } from "express";
import {
    container
} from "../compositions-root";
import { TestDeleteAllDBController } from "../controllers/test-delete-allDB";

const deleteAllDBController = container.resolve(TestDeleteAllDBController)
export const deleteAllDataRouter = Router();

deleteAllDataRouter.delete('/all-data',
    deleteAllDBController.delete.bind(deleteAllDBController))