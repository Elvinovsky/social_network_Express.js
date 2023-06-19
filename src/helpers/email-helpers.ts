import {
    Transporter
} from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const transporterVerify = ( transporter: Transporter<SMTPTransport.SentMessageInfo> ) => {
    return new Promise(( resolve, reject ) => {
        transporter.verify(function ( error, success ) {
            if (error) {
                console.log(error)
                reject(error)
            } else{
                console.log('Server is ready to take our messages')
                resolve(success)
            }
        })
    })
}

export function sendMailPromise ( transporter: Transporter<SMTPTransport.SentMessageInfo>, mailOptions: {} ) {
    return new Promise(( resolve, reject ) => {
        transporter.sendMail(mailOptions,
            ( err, info ) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else{
                    console.log(info);
                    resolve(info);
                }
            });
    });
}