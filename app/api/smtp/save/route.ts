import { testSMTPConnection } from "@/lib/smtp/testConnection"

import { encrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request){
    const response = await req.json()

    console.log(response)

    const testres = await testSMTPConnection(response);

    console.log(testres)

    if(testres.success){

        await prisma.sMTPconfig.upsert({
            where: {
                id: "default"
            },
            create: {
                id: "default",
                host: response.host,
                port: Number(response.port),
                username: response.username,
                password: await encrypt(response.password),
                fromName: response.fromName,
                fromEmail: response.fromEmail,
                security: response.security
            },
            update: {
                host: response.host,
                port: Number(response.port),
                username: response.username,
                password: await encrypt(response.password),
                fromName: response.fromName,
                fromEmail: response.fromEmail,
                security: response.security
            }
        })


        return Response.json({
            success: testres.success
        })
    }

    if(!testres.success){
        return Response.json({
            error: testres.error
        })
    }



        // await prisma.sMTPconfig.upsert({
        //     where: {
        //         id: "default"
        //     },
        //     create: {
        //         id: "default",
        //         host,
        //         port: Number(port),
        //         username,
        //         password: await encrypt(password),
        //         fromName,
        //         fromEmail,
        //         security: secure
        //     },
        //     update: {
        //         host,
        //         port: Number(port),
        //         username,
        //         password: await encrypt(password),
        //         fromName,
        //         fromEmail,
        //         security: secure
        //     }
        // })


    console.log(response)
}