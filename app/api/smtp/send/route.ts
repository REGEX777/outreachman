import { prisma } from "@/lib/prisma";
import { createMailer } from "@/lib/smtp/mail/mailer";


export async function POST(req: Request) {
    const request = await req.json()

    const sMTPconfig = await prisma.sMTPconfig.findUnique({where: {id: "default"}})

    if(!sMTPconfig){
        return Response.json({
            success: false,
            error: "SMTP configuration not found."
        }, { status: 400 })
    }

    const mailer = createMailer(sMTPconfig)

    const uploadRows = await prisma.uploadRow.findMany({where: {uploadId: request.uploadID, status: 'DRAFT'}, include: {upload: true}})
 

    for (const e of uploadRows){
        const emailColumn = e.upload.emailColumn

        const body = e.body
        const subject = e.subject

        if (!subject || !body) {
            console.log("Subject or body missing")
            continue
        }


        if(!emailColumn){
            console.log("EMAIL COLUMN NOT DEFINED")
            return
        }

        

        const data = e.data as Record<string, unknown>

        const email = data[emailColumn]

        if (typeof email !== "string" || !email.trim()) {
            console.log("Invalid email:", email)
            await prisma.upload.update({where: {id: e.uploadId}, data: { failedEmails: +1}})
            continue
        }

        await prisma.uploadRow.update({
            where: {
                id: e.id
            },
            data: {
                status: "SENDING"
            }
        })

        await mailer.sendMail(
            email,
            subject,
            body
        )
        
        await prisma.uploadRow.update({
            where: {
                id: e.id
            },
            data: {
                status: "SENT",
                sentAt: new Date()
            }
        })

        await prisma.upload.update({
            where: {
                id: e.uploadId
            },
            data: {
                sentEmails: {
                    increment: 1
                }
            }
        })
    }


    // console.log(uploadRows[0].data?.[uploadRows[0].upload?.emailColumn])

    return Response.json({
        success: true
    });
}