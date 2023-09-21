import mongoose from "mongoose";

export const objectIdValidator = (id: string) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return id
    }
    return null;
};