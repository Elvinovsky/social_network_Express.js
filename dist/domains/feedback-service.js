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
exports.feedbacksService = void 0;
const feedbacks_repository_1 = require("../repositories/db/feedbacks_repository");
const users_db_repository_1 = require("../repositories/db/users-db-repository");
exports.feedbacksService = {
    searchPostIdForComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield feedbacks_repository_1.feedBacksRepository.searchPostIdForComments(postId);
        });
    },
    createComment(postId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputUserLogin = yield users_db_repository_1.usersRepository.findUserLoginForComment(userId);
            const newComment = {
                postId: postId,
                content: content,
                commentatorInfo: {
                    userId: userId,
                    userLogin: outputUserLogin
                },
                createdAt: new Date().toISOString()
            };
            return yield feedbacks_repository_1.feedBacksRepository.addNewComment(newComment);
        });
    },
    getComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield feedbacks_repository_1.feedBacksRepository.getCommentById(id);
        });
    },
};