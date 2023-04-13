import {UserAccountDBModel} from "../models/modelsUsersLogin/user-input";
import {createTransport} from 'nodemailer'

export const emailsManager = {
    async sendEmailConformationMessage (newUser: UserAccountDBModel):Promise<void> {//todo output type ?


        const transporter = createTransport({
            host: "smtp.mail.ru",
            port:  465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env["AUTH_EMAIL"],
                pass: process.env["AUTH_PASS"]
            }
        })

        const mailOptions = {
            from: 'ELVIN <elov2024@mail.ru>', // sender address
            to: newUser.email, // list of receivers
            subject: 'email confirmation', // Subject line
            html: `<h1>${newUser.emailConfirmation.confirmationCode}</h1>`// plain text body
        }

       transporter.sendMail(mailOptions, function (err, info) {
            if(err)
                console.log(err)
            else
                console.log(info);
        })
    }
}