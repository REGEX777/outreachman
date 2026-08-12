import { testSMTPConnection } from "@/lib/smtp/testConnection"

import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export async function POST(req: Request){
    let response = await req.json()

    let smtpPassword = response.password;

    if (!smtpPassword) {
        const savedConfig = await prisma.sMTPconfig.findUnique({
            where: {
                id: "default"
            }
        })

        if (!savedConfig) {
            return Response.json({
                success: false,
                error: "SMTP configuration not found"
            })
        }

        response.password = decrypt(savedConfig.password)
    }
    const testRes = await testSMTPConnection(response)


    return Response.json({
        success: testRes.success,
        error: testRes.error
    });
}