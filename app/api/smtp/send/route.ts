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
 

        console.log("COLUMN:", emailColumn)
        console.log("RAW EMAIL:", email)
        console.log("JSON EMAIL:", JSON.stringify(email))
        console.log("EMAIL LENGTH:", typeof email === "string" ? email.length : null)

        if (typeof email !== "string" || !email.trim()) {
            console.log("Invalid email:", email)
            continue
        }

        await mailer.sendMail(
            email,
            subject,
            body
        )
    }


    // console.log(uploadRows[0].data?.[uploadRows[0].upload?.emailColumn])

    return Response.json({
        success: true
    });
}