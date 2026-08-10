import nodemailer from "nodemailer"


type SMTPConfig = {
    host: string,
    port: number,
    secure: boolean,
    username: string,
    password: string
}

export async function testSMTPConnection(config: SMTPConfig){
    const transport = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.username,
            pass: config.password
        }
    })

    try{
        await transport.verify()
        return {
            success: true
        }
    }catch(err){
        return {
            success: false,
            error: "Connection to the SMTP server failed."
        }
    }
}