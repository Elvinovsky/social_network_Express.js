import { Router } from "express";
import { deleteAllDBController } from "../compositions-root";

export const deleteAllDataRouter = Router();

deleteAllDataRouter.delete('/all-data',
    deleteAllDBController.delete.bind(deleteAllDBController))