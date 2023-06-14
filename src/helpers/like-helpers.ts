import { LikeDBInfo } from "../models/modelsLike/like-input";

export enum Status { 'None', 'Like', 'Dislike'}

export const statusTypeHelper = (status: LikeDBInfo | null) => {
        if (!status) {
            return "None"
        }
        return status.status
    }

