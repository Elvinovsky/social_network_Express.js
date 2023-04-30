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
exports.feedBacksRouter = void 0;
const express_1 = require("express");
const feedback_service_1 = require("../domains/feedback-service");
const check_bodyComment_1 = require("../middlewares/body-validator/check-bodyComment");
const user_authentication_1 = require("../middlewares/guard-authentication/user-authentication");
exports.feedBacksRouter = (0, express_1.Router)();
exports.feedBacksRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield feedback_service_1.feedbacksService.getComment(req.params.id);
    if (comment) {
        res.send(comment);
    }
    else {
        res.sendStatus(404);
        return;
    }
}));
exports.feedBacksRouter.put('/:id', user_authentication_1.userAuthentication, check_bodyComment_1.validatorInputComment, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorCommentById = yield feedback_service_1.feedbacksService.getComment(req.params.id);
    if (!validatorCommentById) {
        res.sendStatus(404);
        return;
    }
    const validatorUserId = yield feedback_service_1.feedbacksService.searchUserForComment(req.userView.id);
    if (validatorUserId.id !== validatorCommentById.commentatorInfo.userId) {
        res.sendStatus(403);
        return;
    }
    const foundCommentForUpdate = yield feedback_service_1.feedbacksService.updateCommentById(req.params.id, req.body.content);
    if (foundCommentForUpdate) {
        res.sendStatus(204);
        return;
    }
}));
exports.feedBacksRouter.delete('/:id', user_authentication_1.userAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorCommentById = yield feedback_service_1.feedbacksService.getComment(req.params.id);
    if (!validatorCommentById) {
        res.sendStatus(404);
        return;
    }
    const validatorUserId = yield feedback_service_1.feedbacksService.searchUserForComment(req.userView.id);
    if (validatorUserId.id !== validatorCommentById.commentatorInfo.userId) {
        res.sendStatus(403);
        return;
    }
    const deleteComment = yield feedback_service_1.feedbacksService.deletedCountComment(req.params.id);
    if (deleteComment) {
        res.sendStatus(204);
        return;
    }
}));
