import nodemailer from "nodemailer"


type SMTPConfig = {
    host: string,
    port: number,
    secure: boolean,
    username: string,
    password: string
}

export async function testSMTPConnection(config: SMTPConfig){
    console.log("FUNCTION HITTT")
    const transport = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,

        auth: {
            user: config.username,
            pass: config.password
        }
    })
    console.log(config)
    console.log("TRANSPORT CREATED")

    try{
        await transport.verify()
        console.log("TRANSPORT VERIFIED")
        return {
            success: true
        }
    }catch(err){
        console.log(err)
        return {
            success: false,
            error: "Connection to the SMTP server failed."
        }
    }
}