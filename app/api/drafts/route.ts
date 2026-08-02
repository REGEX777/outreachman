import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";


export async function POST(req: Request) {
    const body = await req.json()

    const row = await prisma.uploadRow.update({
        where: {id: body.uploadRowId},
        data: {subject: body.subject, body: body.body}
    })

    console.log(row.rowIndex)

    const upload = await prisma.upload.findUnique({where: {id: row.uploadId}})

    if(!upload){ 
        console.log("hein kya, ye kya bak rahe ho")
        return notFound()
    }

    if(upload.currentRow >= upload.totalRows){
        await prisma.upload.update({where: {id: row.uploadId}, data: {status: 'READY'}})
    }else{
        await prisma.upload.update({where: {id: row.uploadId}, data: {currentRow: {increment: 1}}})
    }

    console.log(upload)

    return Response.json({ success: true });
}