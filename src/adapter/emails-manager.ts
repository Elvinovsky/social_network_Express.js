import {UserAccountDBModel} from "../models/modelsUsersLogin/user-input";
import {createTransport} from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

export const emailsManager = {
    async sendEmailConformationMessage (newUser: UserAccountDBModel):Promise<void> {//todo output type ?


        const transporter = createTransport({
            host: "smtp.mail.ru",
            port:  465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        })

        await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });
        const mailOptions = {
            from: 'ELVIN <elov2024@mail.ru>', // sender address
            to: newUser.email, // list of receivers
            subject: 'email confirmation', // Subject line
            html: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newUser.emailConfirmation.confirmationCode}'>complete registration</a>
        </p>`// plain text body
        }
        await new Promise((resolve, reject) => {
            // send mail
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });

    }
}