import {Response, Router} from "express";
import { RequestParamsId} from "../types/req-res-types";
import {feedbacksService} from "../domains/feedback-service";


export const feedBacksRouter = Router()

feedBacksRouter.get('/:id',
    async (req: RequestParamsId<{ id: string }>,
           res: Response) => {
        const comment = await feedbacksService.getComment(req.params.id)
        if(comment) {
            res.send(comment)
        } else {
            res.sendStatus(404)
            return;
        }
    })


