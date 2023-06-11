import {Router} from "express";
import { deleteAllDBController } from "../controllers/test-delete-allDB";

export const deleteAllDataRouter = Router();

deleteAllDataRouter.delete('/all-data', deleteAllDBController.delete.bind(deleteAllDBController) )