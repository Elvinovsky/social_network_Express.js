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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailsManager = void 0;
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.emailsManager = {
    sendEmailConformationMessage(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = (0, nodemailer_1.createTransport)({
                host: "smtp.mail.ru",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS
                }
            });
            yield new Promise((resolve, reject) => {
                // verify connection configuration
                transporter.verify(function (error, success) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    }
                    else {
                        console.log("Server is ready to take our messages");
                        resolve(success);
                    }
                });
            });
            const mailOptions = {
                from: 'ELVIN <elov2024@mail.ru>',
                to: newUser.email,
                subject: 'email confirmation',
                html: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newUser.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>` // plain text body
            };
            yield new Promise((resolve, reject) => {
                // send mail
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        console.log(info);
                        resolve(info);
                    }
                });
            });
        });
    }
};
