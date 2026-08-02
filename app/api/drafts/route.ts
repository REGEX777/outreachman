import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";

export async function POST(req: Request) {
    const router = useRouter()
    const body = await req.json()

    const row = await prisma.uploadRow.update({
        where: {id: body.uploadRowId},
        data: {subject: body.subject, body: body.body}
    })

    console.log(row.rowIndex)

    const upload = await prisma.upload.findUnique({where: {id: row.uploadId}})

    if(!upload) return notFound()

    if(row.rowIndex === upload.totalRows){
        await prisma.upload.update({where: {id: row.uploadId}, data: {status: 'READY'}})
        return router.push(`/upload/${upload.id}`);
    }else{
        await prisma.upload.update({where: {id: row.uploadId}, data: {currentRow: {increment: 1}}})
    }

    console.log(upload)

    return Response.json({ success: true });
}