import { prisma } from "@/lib/prisma";

export async function POST(req: Request){
    const request = await req.json();


    const stats = await prisma.upload.findUnique({select:{
        sentEmails: true,
        totalRows: true
    }, where: {id: request.uploadID}})


    return Response.json({
        success: true,
        stats: stats
    });
}