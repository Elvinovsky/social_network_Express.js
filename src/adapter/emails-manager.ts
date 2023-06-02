import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'
import {
    sendMailPromise,
    transporterVerify
} from "../helpers/email-helpers";

dotenv.config()

export const emailsManager = {
    async sendEmailConformationMessage ( email: string, newCode: string ): Promise<void> {
        const transporter = createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        })

        try {
            await transporterVerify(transporter)
        } catch (error) {
            console.error(error)
        }

        const mailOptions = {
            from: 'ELVIN <elov2024@mail.ru>', // sender address
            to: email, // list of receivers
            subject: 'email confirmation', // Subject line
            html: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newCode}'>complete registration</a>
        </p>`// plain text body
        }

        // send mail
        try {
             await sendMailPromise(transporter,
                mailOptions);
            // обработка успешного результата
        } catch (err) {
            // обработка ошибки
            console.error(err);
        }
    },

    async sendEmailPasswordRecovery ( email: string, newCode: string ): Promise<void> {
        const transporter = createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        })

        try {
            await transporterVerify(transporter)
        } catch (error) {
            console.error(error)
        }

        const mailOptions = {
            from: 'ELVIN <elov2024@mail.ru>', // sender address
            to: email, // list of receivers
            subject: 'PASSWORD RECOVERY', // Subject line
            html: ` <h1>To finish password recovery</h1>
       <p> Please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${newCode}'>recovery password</a>
      </p>`// plain text body
        }

        // send mail
        try {
             await sendMailPromise(transporter,
                mailOptions);
            // обработка успешного результата
        } catch (err) {
            // обработка ошибки
            console.error(err);
        }
    }
}