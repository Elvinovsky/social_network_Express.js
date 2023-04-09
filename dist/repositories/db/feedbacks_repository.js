"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedBacksRepository = void 0;
const mongodb_1 = require("mongodb");
const runDB_1 = require("../../database/runDB");
function commentMapping(comment) {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    };
}
exports.feedBacksRepository = {
    testingDeleteAllComments() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.feedbacksCollection.deleteMany({});
        });
    },
    searchPostIdForComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postIdForComments = yield runDB_1.postsCollection.findOne({ id: postId });
            return postIdForComments ? postIdForComments : null;
        });
    },
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield runDB_1.feedbacksCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!comment) {
                return null;
            }
            return commentMapping(comment);
        });
    },
    addNewComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield runDB_1.feedbacksCollection.insertOne(comment);
            return {
                id: result.insertedId.toString(),
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt
            };
        });
    },
};
