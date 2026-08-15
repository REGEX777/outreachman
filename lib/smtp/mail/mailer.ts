import { decrypt } from "@/lib/encryption"
import nodemailer from "nodemailer"


type SMTPconfig = {
    host: string, 
    port: number,
    security: "none" | "starttls" | "ssl",
    username: string,
    password: string,
    fromName: string,
    fromEmail: string

}

export function createMailer(config: SMTPconfig){
    if(!config){
        throw new Error("SMTP Configuration has not been configured.")
    }

    const transport = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.security === "ssl",
        auth: {
            user: config.username,
            pass: decrypt(config.password)
        }
    })

    async function sendMail(to: string, subject: string, body: string){
        return transport.sendMail({
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to,
            subject,
            text: body
        })
    }

    return {sendMail}
}