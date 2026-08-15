import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


export async function POST(req: Request) {
    const body = await req.json()

    if(!body.body){
        return Response.json(
            {
                success: false,
                error: "Body Empty",
            },
            {
                status: 400,
            }
        );
    }

    if (!body.subject) {
        return Response.json(
            {
                success: false,
                error: "Subject Empty",
            },
            {
                status: 400,
            }
        );
    }
    
    const row = await prisma.uploadRow.update({
        where: {id: body.uploadRowId},
        data: {subject: body.subject, body: body.body, status: "DRAFT"}
    })


    const upload = await prisma.upload.findUnique({where: {id: row.uploadId}})

    if(!upload){ 
        console.log("No Uploads")
        return notFound()
    }
    
    await prisma.upload.update({where: {id: row.uploadId}, data: {currentRow: {increment: 1}, status: 'READY', draftsWritten: {increment: 1}}})

    return Response.json({ success: true });
}
