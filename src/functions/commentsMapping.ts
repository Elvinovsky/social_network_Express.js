import {WithId} from "mongodb";
import {CommentDBModel, CommentViewModel} from "../models/modelsComment/commentInputModel";

export const commentsMapping = (array: Array<WithId<CommentDBModel>>): CommentViewModel[] =>{
    return array.map((el) => {
        return {
            id: el._id.toString(),
            content: el.content,
            commentatorInfo: {
                userId: el.commentatorInfo.userId,
                userLogin: el.commentatorInfo.userLogin
            },
            createdAt: el.createdAt
        }
    })
}