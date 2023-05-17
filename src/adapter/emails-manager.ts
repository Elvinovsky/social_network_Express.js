import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'

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
        await new Promise(( resolve, reject ) => {
            // verify connection configuration
            transporter.verify(function ( error, success ) {
                if (error) {
                    console.log(error)
                    reject(error)
                } else{
                    console.log("Server is ready to take our messages")
                    resolve(success)
                }
            })
        })
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
        transporter.sendMail(mailOptions,
            ( err, info ) => {
                if (err) {
                    console.error(err)
                } else{
                    console.log(info)
                }
            })
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
        await new Promise(( resolve, reject ) => {
            // verify connection configuration
            transporter.verify(function ( error, success ) {
                if (error) {
                    console.log(error)
                    reject(error)
                } else{
                    console.log("Server is ready to take our messages")
                    resolve(success)
                }
            })
        })
        const mailOptions = {
            from: 'ELVIN <elov2024@mail.ru>', // sender address
            to: email, // list of receivers
            subject: 'PASSWORD RECOVERY', // Subject line
            html: ` <h1>To finish password recovery</h1>
       <p> Please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=your_recovery_code=${newCode}'>recovery password</a>
      </p>`// plain text body
        }

        // send mail
        transporter.sendMail(mailOptions,
            ( err, info ) => {
                if (err) {
                    console.error(err)
                } else{
                    console.log(info)
                }
            })
    }
}